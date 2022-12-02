function build_response(statusCode, body, headers = {}) {
    Object.assign(headers, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Expose-Headers": "X-Total-Count",
        "Content-Type": "application/json"
    })
    return {
        statusCode,
        headers,
        body: JSON.stringify(body),
    };
}

export function success(body,headers = {}) {
    return build_response(200, body, headers);
}

export function success_with_resource(body,headers = {}) {
    return build_response(201, body, headers);
}

export function redirect_temporary(location,headers = {}) {
    headers = {
        ...headers,
        Location: location,
    }
    return build_response(307, {}, headers);
}

export function forbidden(body,headers = {}) {
    return build_response(403, body, headers);
}

export function unauthorized(body,headers = {}) {
    return build_response(401, body, headers);
}

export function bad_request(body,headers = {}) {
    return build_response(400, body, headers);
}

export function not_found(body,headers = {}) {
    return build_response(404, body, headers);
}

export function failure(body,headers = {}) {
    return build_response(500, body, headers);
}