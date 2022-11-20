import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  type: string,
  url?: string,
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      if (!(process.env.MICROSOFT_HOST && process.env.MICROSOFT_CLIENT_ID && process.env.REDIRECT_URI)) {
        throw new Error('invalid environment variables')
      }
      const authUrl = `${process.env.MICROSOFT_HOST}/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=files.readwrite&response_type=code&redirect_uri=${process.env.REDIRECT_URI}`
      return res.json({
        type: 'success',
        url: authUrl
      }) 
    }
    catch (e: any) {
      return res.json({
        type: 'failed',
        message: e.message
      })
    }
    
  }
}
