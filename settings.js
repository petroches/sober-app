{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.addEventListener("DOMContentLoaded", () => \{\
  const form = document.getElementById("settings-form");\
\
  // \uc0\u1047 \u1072 \u1075 \u1088 \u1091 \u1079 \u1080 \u1090 \u1100  \u1089 \u1086 \u1093 \u1088 \u1072 \u1085 \u1105 \u1085 \u1085 \u1099 \u1077  \u1079 \u1085 \u1072 \u1095 \u1077 \u1085 \u1080 \u1103 \
  const settings = getSettings();\
  for (const key in settings) \{\
    if (form.elements[key]) \{\
      form.elements[key].value = settings[key];\
    \}\
  \}\
\
  // \uc0\u1054 \u1073 \u1088 \u1072 \u1073 \u1086 \u1090 \u1095 \u1080 \u1082  \u1089 \u1086 \u1093 \u1088 \u1072 \u1085 \u1077 \u1085 \u1080 \u1103 \
  form.addEventListener("submit", (e) => \{\
    e.preventDefault();\
\
    const newSettings = \{\
      gender: form.elements.gender.value,\
      age: parseInt(form.elements.age.value, 10),\
      weight: parseInt(form.elements.weight.value, 10),\
      country: form.elements.country.value,\
      theme: form.elements.theme.value,\
    \};\
\
    saveSettings(newSettings);\
\
    // \uc0\u1055 \u1088 \u1080 \u1084 \u1077 \u1085 \u1080 \u1090 \u1100  \u1090 \u1077 \u1084 \u1091 \
    applyTheme(newSettings.theme);\
\
    // \uc0\u1042 \u1077 \u1088 \u1085 \u1091 \u1090 \u1100 \u1089 \u1103  \u1085 \u1072  \u1075 \u1083 \u1072 \u1074 \u1085 \u1091 \u1102 \
    window.location.href = "index.html";\
  \});\
\});\
}