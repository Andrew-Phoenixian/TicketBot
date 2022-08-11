@echo off
for %%I in (.) do set dirName=%%~nxI
title %dirName% BOT
:start
node main.js
goto start