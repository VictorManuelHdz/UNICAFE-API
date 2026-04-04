import sanitizeHtml from 'sanitize-html';

const opcionesSanitizacion = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'u', 's', 'h1', 'h2']),
    allowedAttributes: {
        '*': ['style', 'class'],
        'a': ['href', 'name', 'target'],
        'img': ['src', 'alt']
    }
};

export const sanitizarContenido = (req, res, next) => {
    if (req.body && req.body.contenido) {
        // Limpiamos el texto y lo reescribimos en el req.body
        req.body.contenido = sanitizeHtml(req.body.contenido, opcionesSanitizacion);
    }
    
    next();
};