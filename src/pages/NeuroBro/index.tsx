import requests
from fastapi import FastAPI, HTTPException, Header, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
import shutil
import uuid
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import replicate
import asyncio
import logging
import random
import os
import hashlib
import base64
import hmac
import time
from urllib.parse import parse_qsl, urlencode
from dotenv import load_dotenv
import database as db
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - NEUROBRO - %(message)s')
load_dotenv()

app = FastAPI(title="NeuroBro API")

os.makedirs("media", exist_ok=True)
app.mount("/api/bro/media", StaticFiles(directory="media"), name="media")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
VK_APP_SECRET = os.getenv("VK_SERVICE_KEY") 
VK_TOKEN = os.getenv("VK_TOKEN")
BOT_SECRET_TOKEN = os.getenv("BOT_SECRET_TOKEN")
MY_VK_ID = int(os.getenv("MY_VK_ID", 233876992))
client = replicate.Client(api_token=REPLICATE_API_TOKEN)

# --- УНИВЕРСАЛЬНАЯ СИСТЕМА ЗАЩИТЫ (ВК + ВЕБ-САЙТ) ---
def verify_safe_call(target_user_id: int, x_vk_sign: str = None, x_bot_token: str = None):
    # 1. Авторизация с веб-сайта по секретному токену
    if x_bot_token and BOT_SECRET_TOKEN and x_bot_token == BOT_SECRET_TOKEN:
        return True

    # 2. Авторизация из VK Mini Apps по подписи
    if x_vk_sign and VK_APP_SECRET:
        try:
            query_params = dict(parse_qsl(x_vk_sign, keep_blank_values=True))
            vk_sign = query_params.pop('sign', None)
            
            vk_params = {k: v for k, v in query_params.items() if k.startswith('vk_')}
            ordered_params = sorted(vk_params.items())
            params_str = urlencode(ordered_params, safe=':/')
            
            secret_bytes = VK_APP_SECRET.encode('utf-8')
            params_bytes = params_str.encode('utf-8')
            
            hmac_hash = hmac.new(secret_bytes, params_bytes, hashlib.sha256).digest()
            decoded_hash = base64.b64encode(hmac_hash).decode('utf-8')
            
            expected = decoded_hash.rstrip('=')
            actual = vk_sign.rstrip('=').replace('-', '+').replace('_', '/')
            
            if expected == actual:
                return True
        except Exception as e:
            logging.error(f"⚠️ VK AUTH ERROR: {e}")

    logging.error(f"⛔️ AUTH ERROR: Отклонен доступ для юзера {target_user_id}")
    raise HTTPException(status_code=403, detail="Forbidden: Invalid Authorization")

# --- СЛОВАРЬ ПРОФЕССИЙ ---
SYSTEM_PROMPTS = {
    "default": "Ты полезный, умный и вежливый ИИ-ассистент.",
    "coder": "Ты Senior разработчик. Пиши чистый код.",
    "language_coach": "Ты опытный преподаватель английского и языковой коуч. Помогай с грамматикой и переводами.",
    "health": "Ты профессиональный ЗОЖ-Наставник. Давай советы по тренировкам, питанию и режиму дня.",
    "psychologist": "Ты эмпатичный психолог-коуч. Помогай людям разбираться в их чувствах, давай поддержку.",
    "hr": "Ты карьерный HR-эксперт. Помогай с резюме, собеседованиями и поиском работы.",
    "tutor": "Ты Умный Репетитор. Объясняй сложные темы школьной и университетской программы просто и понятно. Решай задачи пошагово.",
    "copywriter": "Ты гениальный Копирайтер и маркетолог. Пиши продающие, вовлекающие и грамотные тексты для соцсетей, сайтов и рассылок.",
    "strategist": "Ты опытный Бизнес-стратег. Помогай с планированием, анализом конкурентов, бизнес-моделями и стартап-идеями."
}

active_chat_users = {}

class PersonalAIRequest(BaseModel):
    user_id: int
    prompt: str 
    clear_history: bool = False 
    model_type: str = "gpt4o_mini"
    persona: str = "default"
    attachments: Optional[List[str]] = []

class BonusRequest(BaseModel):
    user_id: int

# --- ОБЕРТКА ДЛЯ REPLICATE ---
async def ask_replicate(model_name: str, system_prompt: str, user_prompt: str, history_msgs: list, max_tokens: int, image_path: Optional[str] = None) -> str:
    if not REPLICATE_API_TOKEN:
        raise Exception("REPLICATE_API_TOKEN не настроен в .env")

    full_prompt_context = f"System: {system_prompt}\n\n"
    for msg in history_msgs:
        role = "User" if msg['role'] == 'user' else "Assistant"
        full_prompt_context += f"{role}: {msg['content']}\n"
    
    full_prompt_context += f"User: {user_prompt}\nAssistant:"

    input_data = {
        "prompt": full_prompt_context,
        "max_completion_tokens": max_tokens,
        "temperature": 0.7
    }

    if image_path and os.path.exists(image_path):
        try:
            image_file = open(image_path, "rb")
            if "kimi" in model_name.lower():
                input_data["image"] = image_file
            else:
                input_data["image_input"] = [image_file]
            logging.info(f"📸 Картинка {image_path} прикреплена к запросу ({model_name})")
        except Exception as img_err:
            logging.error(f"⚠️ Ошибка картинки: {img_err}")

    def run_replicate():
        output = client.run(model_name, input=input_data)
        if isinstance(output, list):
            return "".join([str(chunk) for chunk in output]).strip()
        elif hasattr(output, 'read'):
            return output.read().decode('utf-8').strip()
        return str(output).strip()

    try:
        logging.info(f"🚀 Запрос в Replicate ({model_name})...")
        response_text = await asyncio.to_thread(run_replicate)
        return response_text
    except Exception as e:
        logging.error(f"❌ Ошибка Replicate ({model_name}): {e}")
        raise e
    finally:
        if "image" in input_data and hasattr(input_data["image"], "close"):
            input_data["image"].close()
        elif "image_input" in input_data and isinstance(input_data["image_input"], list):
            for item in input_data["image_input"]:
                if hasattr(item, "close"):
                    item.close()

@app.on_event("startup")
async def startup_event():
    db.init_db()
    logging.info("⚡️ Сервер NeuroBro успешно запущен!")

@app.get("/api/bro/user/{user_id}")
async def get_user_energy(
    user_id: int, 
    x_vk_sign: Optional[str] = Header(None),
    x_bot_token: Optional[str] = Header(None, alias="X-Bot-Token")
):
    verify_safe_call(user_id, x_vk_sign, x_bot_token)
    energy = db.get_energy(user_id)
    
    bonus_file = "claimed_bro_bonuses.txt"
    bonus_claimed = False
    if os.path.exists(bonus_file):
        with open(bonus_file, "r", encoding="utf-8") as f:
            if str(user_id) in f.read().splitlines():
                bonus_claimed = True

    if energy is None:
        db.add_user(user_id, username='user', initial_balance=5, initial_energy=20)
        energy = 20
        send_vk_message(MY_VK_ID, f"🚀 Новый пользователь в НейроБро!\nID: {user_id}\nБаланс: 20 ⚡️")
        
    return {"success": True, "energy": energy, "bonus_claimed": bonus_claimed}

@app.get("/api/bro/history")
async def get_history(
    user_id: int, 
    x_vk_sign: Optional[str] = Header(None),
    x_bot_token: Optional[str] = Header(None, alias="X-Bot-Token")
):
    verify_safe_call(user_id, x_vk_sign, x_bot_token)
    history = db.get_chat_history(user_id, limit=20)
    return {"success": True, "history": history}

@app.post("/api/bro/chat")
async def handle_chat(
    request: PersonalAIRequest, 
    x_vk_sign: Optional[str] = Header(None),
    x_bot_token: Optional[str] = Header(None, alias="X-Bot-Token")
):
    verify_safe_call(request.user_id, x_vk_sign, x_bot_token)

    if request.user_id in active_chat_users:
        last_request_time = active_chat_users[request.user_id]
        if time.time() - last_request_time < 120:
            raise HTTPException(status_code=429, detail="Пожалуйста, дождитесь ответа.")

    active_chat_users[request.user_id] = time.time()

    COSTS_MAP = {
        "gpt4o_mini": 3,
        "gemini_flash": 10,
        "gemini_31_pro": 50
    }
    
    request_cost = COSTS_MAP.get(request.model_type, 3)

    if request.attachments and len(request.attachments) > 0:
        request.attachments = [request.attachments[0]]

    energy = db.get_energy(request.user_id)
    if energy is None or energy < request_cost: 
        raise HTTPException(status_code=402, detail=f"Нужно {request_cost} ⚡ для этого запроса.")

    try:
        db.update_energy(request.user_id, -request_cost)
        db.save_chat_message(request.user_id, "user", request.prompt)

        sys_prompt = SYSTEM_PROMPTS.get(request.persona, SYSTEM_PROMPTS["default"])
        current_date = datetime.now().strftime("%d %B %Y года")
        safe_sys_prompt = sys_prompt + f" ВАЖНО: Текущая дата: {current_date}. Ты УМЕЕШЬ видеть фото. НЕ умеешь рисовать."

        raw_history = db.get_chat_history(request.user_id, limit=20)
        
        if raw_history and raw_history[-1]['role'] == 'user' and raw_history[-1]['content'] == request.prompt:
            history_msgs = raw_history[:-1]
        else:
            history_msgs = raw_history
            
        history_msgs = history_msgs[-10:]

        token_limit = 8000 if request.user_id == MY_VK_ID else 1500

        local_image_path = None
        if request.attachments and len(request.attachments) > 0:
            attach_item = request.attachments[0]
            if attach_item.startswith("http"):
                filename = attach_item.split("/")[-1]
                local_image_path = f"media/{filename}"

        if request.model_type == "gpt4o_mini" and not local_image_path:
            full_response = await ask_replicate(
                model_name="openai/gpt-4.1-nano",
                system_prompt=safe_sys_prompt,
                user_prompt=request.prompt,
                history_msgs=history_msgs,
                max_tokens=token_limit
            )
            db.save_chat_message(request.user_id, "assistant", full_response)
            return {"success": True, "response": full_response}

        elif request.model_type == "gemini_flash":
            full_response = await ask_replicate(
                model_name="openai/gpt-4.1-mini",
                system_prompt=safe_sys_prompt,
                user_prompt=request.prompt,
                history_msgs=history_msgs,
                max_tokens=token_limit,
                image_path=local_image_path
            )
            db.save_chat_message(request.user_id, "assistant", full_response)
            return {"success": True, "response": full_response}

        elif request.model_type == "gemini_31_pro":
            full_response = await ask_replicate(
                model_name="moonshotai/kimi-k2.5",
                system_prompt=safe_sys_prompt,
                user_prompt=request.prompt,
                history_msgs=history_msgs,
                max_tokens=token_limit,
                image_path=local_image_path
            )
            db.save_chat_message(request.user_id, "assistant", full_response)
            return {"success": True, "response": full_response}

        else:
            db.update_energy(request.user_id, request_cost)
            full_response = "🤖 Режим «Быстрая» работает только с текстом. Для фото переключитесь на «Думающая» или «Про»!"
            db.save_chat_message(request.user_id, "assistant", full_response)
            return {"success": True, "response": full_response}

    except Exception as e:
        logging.error(f"Ошибка генерации: {e}")
        db.update_energy(request.user_id, request_cost)
        return {"success": False, "error": str(e)}
    finally:
        active_chat_users.pop(request.user_id, None)

@app.post("/api/bro/chat/clear")
async def clear_chat(
    request: PersonalAIRequest, 
    x_vk_sign: Optional[str] = Header(None),
    x_bot_token: Optional[str] = Header(None, alias="X-Bot-Token")
):
    verify_safe_call(request.user_id, x_vk_sign, x_bot_token)
    db.clear_chat_history(request.user_id)
    return {"success": True, "response": "Память очищена! 🧹"}

@app.post("/api/bro/upload")
async def upload_file(
    user_id: int = Form(...), 
    file: UploadFile = File(...), 
    x_vk_sign: Optional[str] = Header(None),
    x_bot_token: Optional[str] = Header(None, alias="X-Bot-Token")
):
    verify_safe_call(user_id, x_vk_sign, x_bot_token)
    try:
        ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        if ext not in ['jpg', 'jpeg', 'png', 'webp']:
            return {"success": False, "error": "Поддерживаются только JPG, PNG, WEBP."}

        filename = f"bro_{uuid.uuid4().hex}.{ext}"
        filepath = f"media/{filename}"
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_url = f"http://83.217.202.227:8002/api/bro/media/{filename}"
        return {"success": True, "url": file_url}
        
    except Exception as e:
        logging.error(f"Ошибка загрузки: {e}")
        return {"success": False, "error": "Ошибка при загрузке файла."}

def send_vk_message(target_user_id: int, text: str):
    if not VK_TOKEN:
        return
    try:
        url = "https://api.vk.com/method/messages.send"
        params = {
            "user_id": target_user_id,
            "random_id": random.randint(1, 2147483647),
            "message": text,
            "access_token": VK_TOKEN,
            "v": "5.131"
        }
        requests.post(url, data=params, timeout=5)
    except Exception as e:
        logging.error(f"❌ Ошибка отправки в ВК: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("neurobro_server:app", host="0.0.0.0", port=8002, workers=1)