{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const SETTINGS_KEY = "user_settings";\
\
function getSettings() \{\
  const defaults = \{\
    gender: "male",\
    age: 30,\
    weight: 70,\
    country: "RU",\
    theme: "auto",\
  \};\
\
  try \{\
    const saved = localStorage.getItem(SETTINGS_KEY);\
    return saved ? \{ ...defaults, ...JSON.parse(saved) \} : defaults;\
  \} catch (e) \{\
    return defaults;\
  \}\
\}\
\
function saveSettings(settings) \{\
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));\
\}\
\
function applyTheme(mode) \{\
  const html = document.documentElement;\
  html.dataset.theme = mode;\
\}\
}