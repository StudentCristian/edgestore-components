import { JSDOM } from "jsdom";  
  
export const setGlobal = (name: string, value: unknown) => {  
    const g = globalThis as any;  
    const desc = Object.getOwnPropertyDescriptor(g, name);  
  
    if (!desc) {  
        Object.defineProperty(g, name, {  
            value,  
            configurable: true,  
            writable: true,  
            enumerable: true,  
        });  
        return;  
    }  
  
    if (desc.writable) {  
        g[name] = value;  
        return;  
    }  
  
    if (desc.configurable) {  
        Object.defineProperty(g, name, {  
            value,  
            configurable: true,  
            writable: true,  
            enumerable: desc.enumerable ?? false,  
        });  
        return;  
    }  
  
    try {  
        if ((g as any).window && typeof (g as any).window === "object") {  
            try {  
                (g as any).window[name] = value;  
                return;  
            } catch {  
                // ignore  
            }  
        }  
    } catch {  
        // ignore  
    }  
  
    const alias = `__jsdom_${name}`;  
    Object.defineProperty(g, alias, {  
        value,  
        configurable: true,  
        writable: true,  
        enumerable: false,  
    });  
};  
  
export const installJsdomGlobals = (html = "<!doctype html><html><body></body></html>") => {  
    const dom = new JSDOM(html);  
  
    setGlobal("window", dom.window);  
    setGlobal("document", dom.window.document);  
    setGlobal("navigator", dom.window.navigator);  
    setGlobal("HTMLElement", dom.window.HTMLElement);  
    setGlobal("Node", dom.window.Node);  
  
    return dom;  
};  
  
export const dom = installJsdomGlobals();  
export default dom;