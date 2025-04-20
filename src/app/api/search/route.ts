import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: NextRequest){
    const {searchParams} = request.nextUrl;
    const query = searchParams.get('q');

    if(!query){
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    try {
        const results = await yahooFinance.search(query);
        return NextResponse.json(results);
    } catch(error){
        console.error("Error searching stocks:", error);
        return NextResponse.json({
            error:"Failed to search stocks"
        }, {
            status:500
        });
    }
}