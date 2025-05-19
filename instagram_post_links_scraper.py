"""
Instagram scraper (5 primeiros posts) reaproveitando o perfil do Chrome

Como funciona
-------------
• Usa o diretório de usuário do Chrome já logado (sem cookies manuais).
• Abre o perfil de destino, espera o grid, faz pequena pausa.
• Para cada um dos N primeiros posts:
      – Reconstrói o link canônico  https://www.instagram.com/p/<shortcode>/
      – Abre o modal, extrai a legenda/caption (primeiro comentário)
• Imprime link + legenda no console.

Requerimentos:
    pip install selenium webdriver-manager
Testado em Chrome 125 + Windows 10.
"""

import random
import time
from urllib.parse import urlsplit, urlunsplit

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


# ------------------------------------------------------------------
# CONFIGURAÇÕES
# ------------------------------------------------------------------
# Caminho do perfil do Chrome já logado
# Windows (icaro):
USER_DATA_DIR = r"C:\Users\icaro\AppData\Local\Google\Chrome\User Data"
PROFILE_DIR   = "Default"          # ou "Profile 1", "Profile 2"...

# Exemplo para macOS:
# USER_DATA_DIR = "/Users/icaro/Library/Application Support/Google/Chrome"
# PROFILE_DIR = "Default"

PERFIL      = "https://www.instagram.com/nasa/"   # perfil alvo (barra final!)
NUM_POSTS   = 5                                   # quantos posts coletar
TIMEOUT_UI  = 12                                  # segundos de espera (WebDriver)


# Pequena função para dormir aleatoriamente (parecer humano)
def human_sleep(a: float = 2.0, b: float = 4.0):
    time.sleep(random.uniform(a, b))


# ------------------------------------------------------------------
# CONFIGURAÇÃO DO CHROME
# ------------------------------------------------------------------
options = webdriver.ChromeOptions()
options.add_argument(f"--user-data-dir={USER_DATA_DIR}")
options.add_argument(f"--profile-directory={PROFILE_DIR}")

# NÃO use headless aqui — o Chrome precisa do perfil completo
# options.add_argument("--headless=new")

options.add_argument("--window-size=1366,768")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--lang=pt-BR")

# Se quiser personalizar user-agent:
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/125.0.0.0 Safari/537.36"
)

# Cria o driver
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)
wait = WebDriverWait(driver, TIMEOUT_UI)

try:
    # 1) Abre o perfil já logado
    driver.get(PERFIL)

    # 2) Aguarda o grid de posts aparecer
    wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "article a")))
    time.sleep(2)   # pausa extra para carregar miniaturas

    # 3) Coleta os N primeiros posts visíveis
    posts = driver.find_elements(By.CSS_SELECTOR, "article a")[:NUM_POSTS]
    print(f"\nColetando {len(posts)} posts de {PERFIL}\n")

    for idx, post in enumerate(posts, start=1):
        # ----------------------------------------------------------
        # 3.1) Gera link canônico (sem nome do perfil)
        # ----------------------------------------------------------
        raw_link = post.get_attribute("href")               # .../nasa/p/<shortcode>/
        parts = urlsplit(raw_link)
        path_parts = parts.path.strip("/").split("/")
        if len(path_parts) >= 3 and path_parts[1] == "p":
            canonical_path = "/" + "/".join(path_parts[1:]) + "/"
            link = urlunsplit((parts.scheme, parts.netloc, canonical_path, "", ""))
        else:
            link = raw_link  # fallback (não deveria ocorrer)

        # ----------------------------------------------------------
        # 3.2) Abre o modal do post
        # ----------------------------------------------------------
        driver.execute_script("arguments[0].scrollIntoView()", post)
        human_sleep(0.8, 1.4)
        post.click()

        dialog = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div[role='dialog']"))
        )

        # ----------------------------------------------------------
        # 3.3) Extrai a legenda (caption)
        # ----------------------------------------------------------
        try:
            caption_elem = dialog.find_element(
                By.CSS_SELECTOR, "ul > div > li div div div span"
            )
            caption = caption_elem.text.strip() or "(legenda vazia)"
        except Exception:
            caption = "(não consegui encontrar a legenda)"

        print(f"{idx}. {link}\n   ↳ {caption}\n")

        # ----------------------------------------------------------
        # 3.4) Fecha o modal e pausa
        # ----------------------------------------------------------
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        human_sleep()

finally:
    driver.quit()
