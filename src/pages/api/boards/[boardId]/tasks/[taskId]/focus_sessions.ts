// src/pages/board/[boardId]/task/[taskId]/añadir_bloque_trabajo.ts
import { Client } from '@notionhq/client';
const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });


export async function POST({ params, request }) {
    const boardId = params.boardId!;
    const taskId = params.taskId!;
    const { duration, user } = await request.json();

    if (!duration || !user) {
        return new Response(JSON.stringify({ error: "Missing Data" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const task = await notion.pages.retrieve({ page_id: taskId });

    const properties = task.properties;

    const focusLogProp = properties["Focus Log"];
    const focusSummaryProp = properties["Focus Summary"];

    let focusLog = [];
    let focusSummary = {};


    if (focusLogProp && focusLogProp.rich_text.length > 0) {
        try {
            focusLog = JSON.parse(focusLogProp.rich_text[0].plain_text);
        } catch (err) {
            console.error("Focus Log parse error:", err);
        }
    }

    if (focusSummaryProp && focusSummaryProp.rich_text.length > 0) {
        try {
            focusSummary = JSON.parse(focusSummaryProp.rich_text[0].plain_text);
        } catch (err) {
            console.error("Focus Summary parse error:", err);
        }
    }

    const newLog = {
        user,
        duration,
        fecha: new Date().toISOString(),
    };
    focusLog.push(newLog);

    focusSummary[user] = (focusSummary[user] || 0) + duration;

    await notion.pages.update({
        page_id: taskId,
        properties: {
            "Focus Log": {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: JSON.stringify(focusLog)
                        }
                    }
                ]
            },
            "Focus Summary": {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: JSON.stringify(focusSummary)
                        }
                    }
                ]
            }
        }
    });

    return new Response(
        JSON.stringify({
            mensaje: "Focus log added",
        }),{ 
            headers: { "Content-Type": "application/json" }
        }
    );
};
