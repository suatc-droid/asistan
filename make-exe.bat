@echo off
title Kurumsal Is Asistani - EXE Paketleme Sihirbazi
color 0B
echo ====================================================================
echo      🤖 KURUMSAL IS ASISTANI - NATIVE WINDOWS EXE DERLEME 🤖
echo ====================================================================
echo.
echo Bu sihirbaz, uygulamanizi bilgisayarinizda tarayicidan bagimsiz,
echo masaustunde seyyar gezen ve her zaman en ustte durabilen gercek bir
echo Windows (.EXE) uygulamasina donusturecektir.
echo.
echo GEREKSINIMLER:
echo - Bilgisayarinizda Node.js kurulu olmalidir (https://nodejs.org).
echo.
echo Islem baslatilsin mi? (Devam etmek icin bir tusa basin...)
pause > nul
echo.
echo --------------------------------------------------------------------
echo [1/3] ADIM: Proje Bagimliliklari Yukleniyor (NPM Install)...
echo --------------------------------------------------------------------
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [HATA] Bagimliliklar yuklenirken bir sorun olustu. Node.js kurulu mu?
    goto error
)
echo.
echo --------------------------------------------------------------------
echo [2/3] ADIM: Masaustu Motoru Yukleniyor (Electron Dev)...
echo --------------------------------------------------------------------
call npm install --save-dev electron electron-builder
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [HATA] Electron motoru yuklenemedi. Internet baglantinizi kontrol edin.
    goto error
)
echo.
echo --------------------------------------------------------------------
echo [3/3] ADIM: Uygulama Paketleme & EXE Derleme Yapiliyor...
echo --------------------------------------------------------------------
call npm run electron:pack
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [HATA] EXE derleme asamasinda bir hata meydana geldi.
    goto error
)
echo.
echo ====================================================================
echo 🎉 TEBRIKLER! NATIVE WINDOWS EXE UYGULAMANIZ HAZIR! 🎉
echo ====================================================================
echo.
echo Derlenen uygulamayi ve tasinabilir (Portable) EXE dosyasini:
echo "- dist_desktop" klasorunde bulabilirsiniz!
echo.
echo Yonergeler:
echo 1. Klasor icindeki "KurumsalIsAsistani.exe" dosyasini masaustunuze kopyalayin.
echo 2. Cift tiklayarak baslatin.
echo 3. Sistem tepsisindeki (Tray) ikona sag tiklayarak asistan robotu
echo    masaustunuze firlatabilir ve her yerde gezdirebilirsiniz!
echo.
goto end

:error
echo.
echo [HATA] Derleme islemi basarisiz oldu. Lutfen adimlari manuel olarak deneyin:
echo 1. cmd ekraninda 'npm install' yazin
echo 2. 'npm install --save-dev electron electron-builder' yazin
echo 3. 'npm run electron:pack' yazarak kendiniz derleyin.
echo.

:end
pause
