@echo off
title Login Instagram — Running Post
cd /d "C:\Users\roman\code claude"
echo.
echo ============================================
echo   LOGIN INSTAGRAM — Running Post 2026
echo ============================================
echo.
echo Aguarde o Chrome abrir...
echo Faca login normalmente no Instagram.
echo A sessao sera salva automaticamente.
echo.
python postar_instagram.py --login
echo.
if %errorlevel% == 0 (
    echo LOGIN SALVO COM SUCESSO!
) else (
    echo Algo deu errado. Tente novamente.
)
echo.
pause
