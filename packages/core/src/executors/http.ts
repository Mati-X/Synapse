import {NodeCategory, NodeExecutor, NodeExecutorResult} from "../types/execution";
import {interpolate} from "../engine/interpolator";

export type HttpMethod =  'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HttpRequestConfig = {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
}

export class HttpRequestExecutor implements NodeExecutor<HttpRequestConfig> {
    type = "HTTP_REQUEST";
    category: NodeCategory = 'ACTION';
    async execute(config : HttpRequestConfig, context: any ): Promise<NodeExecutorResult> {
        let url = interpolate(config.url, context.variables);

        let headers  = config.headers;

        if (headers) {
            for  (const [key, value] of Object.entries(headers)) {
                headers[key] = interpolate(value, context.variables);
            }
        }

        if  (config.body && (config.method == "POST" || config.method == "PATCH" || config.method == "PUT")) {
            config.body = interpolate(config.body, context.variables);
        }
            else  {
                config.body = undefined;
            }

        const res: Response = await fetch(url, {
            method: config.method,
            headers: headers,
            body: config.body
        });

        let text = await res.text();
        let data = text;

        try {
            data = JSON.parse(data);
        }
        catch (error) {
            data = text
        }

        return {
            output : {
                status: res.status,
                ok: res.ok,
                data: data
            }
        }
    }
}