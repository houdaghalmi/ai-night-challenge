import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    const cohereApiKey = process.env.COHERE_API_KEY;

    if (!cohereApiKey) {
      return NextResponse.json(
        { response: 'API non configurée. Veuillez ajouter COHERE_API_KEY à .env.local' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cohereApiKey}`,
      },
      body: JSON.stringify({
        message: message,
        preamble: `Tu es un assistant virtuel expert et chaleureux pour l'agence de voyage 'Tourisia'. 
Tu réponds naturellement aux questions des voyageurs, tu proposes des recommandations touristiques spécialisées en Tunisie et tu aides les utilisateurs à planifier leurs vacances de rêve. 
Reste concis, clair, et garde toujours un ton professionnel et de qualité premium.
Donne des conseils sur les destinations tunisiennes, les meilleurs moments pour visiter, les budgets, les activités, la culture locale, et les spécialités culinaires.`,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cohere API error:', error);
      return NextResponse.json(
        { response: 'Erreur de service IA. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const botResponse = data.text || 'Désolé, je n\'ai pas pu générer une réponse.';

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { response: 'Erreur serveur. Impossible de contacter l\'assistant.' },
      { status: 500 }
    );
  }
}
