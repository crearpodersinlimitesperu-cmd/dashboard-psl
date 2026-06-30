/**
 * ============================================================================
 *                    CREAR PODER SIN LIMITES - GOOGLE APPS SCRIPT
 * ============================================================================
 * Autor: Lead Data Engineer & Enterprise React Architect
 * Propósito: API Maestra ("CREAR OS") para lectura quirúrgica en la nube,
 *            conector permanente de memoria de IA y sincronización de directorios.
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Ve a https://script.google.com
 * 2. Crea un nuevo proyecto llamado "CREAR_OS_API_MAESTRA".
 * 3. Reemplaza todo el contenido del archivo Codigo.gs con este código.
 * 4. Guarda el proyecto (clic en el ícono de disco).
 * 5. Haz clic en "Implementar" (Deploy) -> "Nueva implementación" (New deployment).
 * 6. Selecciona tipo: "Aplicación web" (Web app).
 * 7. Configura:
 *    - Descripción: "CREAR OS API Maestra v1.0.0"
 *    - Ejecutar como: "Tú" (Tu cuenta de Google con acceso a los archivos).
 *    - Quién tiene acceso: "Cualquier persona" (Anyone) -> REQUISITO CRÍTICO para CORS y React.
 * 8. Haz clic en "Implementar", autoriza los permisos requeridos y copia la "URL de la aplicación web".
 * 9. Pega esa URL en la constante `SCRIPT_URL` dentro de `src/App.jsx` de tu frontend.
 * ============================================================================
 */

// Directorio maestro de los 7 archivos Spreadsheets de "CREAR Poder Sin Límites"
var SPREADSHEET_MAP = {
  "LIMA_HISTORICO": "1TMaKPPzPbQE0sTmlWzwzgXBeed7nAcWq",
  "CDMX_HISTORICO": "164p28NXFDaq_azmw_U5L3fYMypdDRvtL",
  "QUITO_HISTORICO": "12RvEiUQl_M__VpUW3juguFjRZRv05NaD",
  "MEDELLIN_HISTORICO": "17TDyo7n7QHijY8-1ynPIUQwrMBdll-Qd",
  "GUAYAQUIL_HISTORICO": "16aFqD8BmPS2qxFoYK8b0IRBIB5DXC5Fg",
  "CUENCA_HISTORICO": "1L-YT7qMwCU_sM3LJi142N7-17EH4J8XT",
  "DIRECTORIO_GLOBAL": "17PAj3H3vXpH6GCuPTxprbYakbYozV6xU"
};

// Spreadsheet principal para almacenar la Memoria de IA
var PRIMARY_MEMORIA_ID = "1TMaKPPzPbQE0sTmlWzwzgXBeed7nAcWq";

/**
 * Maneja las peticiones GET desde el panel "CREAR OS"
 */
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "directorio";
  
  if (action === "memoria") {
    return getMemoriaIA();
  } else {
    return getDirectorioCompleto();
  }
}

/**
 * Maneja las peticiones POST para persistir la memoria del Copiloto IA
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respondJson({ status: "error", message: "Falta el cuerpo de la petición (No post data)" });
    }
    
    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      // Intentar parsear si llega como formato url-encoded o texto crudo
      payload = parseQueryString(e.postData.contents);
    }
    
    var pregunta = payload.pregunta || payload.question;
    var respuesta = payload.respuesta || payload.answer;
    
    if (!pregunta || !respuesta) {
      return respondJson({ status: "error", message: "Los campos 'pregunta' y 'respuesta' son requeridos." });
    }
    
    saveToMemoriaIA(pregunta, respuesta);
    
    return respondJson({ status: "SUCCESS", message: "Memoria registrada exitosamente en la nube." });
  } catch (err) {
    return respondJson({ status: "ERROR", message: err.toString() });
  }
}

/**
 * Retorna la base documental completa leyendo quirúrgicamente pestañas VISIBLES y NO VISIBLES
 */
function getDirectorioCompleto() {
  var response = {
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    files: {}
  };
  
  for (var fileTag in SPREADSHEET_MAP) {
    var fileId = SPREADSHEET_MAP[fileTag];
    try {
      var ss = SpreadsheetApp.openById(fileId);
      var sheets = ss.getSheets();
      
      var fileData = {
        status: "SUCCESS",
        real_name: ss.getName(),
        file_id: fileId,
        sheets: {}
      };
      
      for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];
        var sheetName = sheet.getName();
        
        // Saltar la hoja interna de memoria de IA para no duplicar datos en el directorio documental
        if (sheetName === "Memoria_IA") continue;
        
        // Obtener estado de visibilidad (VISIBLE o OCULTA)
        // isSheetHidden() devuelve true si la pestaña está oculta
        var isHidden = sheet.isSheetHidden();
        var isVisible = !isHidden;
        
        var range = sheet.getDataRange();
        var values = range.getValues();
        var rowsCount = values.length;
        
        fileData.sheets[sheetName] = {
          metadata: {
            visible: isVisible,
            rows_count: rowsCount
          },
          data: values // Retorna la matriz completa de datos sin omitir nada
        };
      }
      
      response.files[fileTag] = fileData;
      
    } catch (err) {
      // Capturamos el error para que un archivo sin accesibilidad no bote todo el dashboard
      response.files[fileTag] = {
        status: "ERROR",
        real_name: fileTag.replace(/_/g, " "),
        file_id: fileId,
        message: "Error de acceso: " + err.toString(),
        sheets: {}
      };
    }
  }
  
  return respondJson(response);
}

/**
 * Recupera el historial de conversaciones guardado en la pestaña "Memoria_IA"
 */
function getMemoriaIA() {
  try {
    var ss = SpreadsheetApp.openById(PRIMARY_MEMORIA_ID);
    var sheet = ss.getSheetByName("Memoria_IA");
    if (!sheet) {
      return respondJson([]);
    }
    
    var values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return respondJson([]); // Solo cabecera
    }
    
    var history = [];
    // Omitimos la primera fila (Fecha, Pregunta, Respuesta)
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (row[1] && row[2]) {
        history.push({
          fecha: row[0],
          pregunta: row[1],
          respuesta: row[2]
        });
      }
    }
    return respondJson(history);
  } catch (err) {
    return respondJson({ status: "ERROR", message: "Error al leer Memoria_IA: " + err.toString() });
  }
}

/**
 * Agrega un nuevo registro de memoria a la hoja "Memoria_IA"
 */
function saveToMemoriaIA(pregunta, respuesta) {
  var ss = SpreadsheetApp.openById(PRIMARY_MEMORIA_ID);
  var sheet = ss.getSheetByName("Memoria_IA");
  
  if (!sheet) {
    sheet = ss.insertSheet("Memoria_IA");
    sheet.appendRow(["Fecha", "Pregunta", "Respuesta"]);
    // Estilizar cabecera
    sheet.getRange(1, 1, 1, 3)
         .setFontWeight("bold")
         .setBackground("#007AFF")
         .setFontColor("#FFFFFF")
         .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  
  // Agregar registro con estampa de tiempo
  sheet.appendRow([new Date(), pregunta, respuesta]);
}

/**
 * Helper para estructurar respuestas JSON amigables con CORS
 */
function respondJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper para parsear querystrings si los datos POST no llegan como JSON puro
 */
function parseQueryString(str) {
  var params = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    var val = decodeURIComponent(pair[1] || '');
    if (key) {
      // Intentar ver si el valor es un objeto JSON stringificado
      try {
        params = JSON.parse(str);
        return params;
      } catch(e) {}
      params[key] = val;
    }
  }
  return params;
}
