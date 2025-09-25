export function onRequest(context) {
    return new Response("Why are you here? Maybe sometime I'll make this page look cool. Lmk if you have any suggestions", {
        status: 404,
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
}   
