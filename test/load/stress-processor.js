module.exports = {
  beforeRequest: (requestParams, context, ee, next) => {
    // Log de requests para debugging
    console.log(`Making request to: ${requestParams.url}`)
    return next()
  },

  afterResponse: (requestParams, response, context, ee, next) => {
    // Verificar respuestas de estrés
    if (response.statusCode >= 400) {
      console.log(`Error response: ${response.statusCode}`)
    }
    return next()
  },
}
