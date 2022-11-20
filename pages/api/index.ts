import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
        let code = req.body.code;
        let params = new URLSearchParams();
        params.append('client_id', `${process.env.MICROSOFT_CLIENT_ID}`);
        params.append('scope', 'files.readwrite');
        params.append('redirect_uri', `${process.env.REDIRECT_URI}`);
        params.append('code', `${code}`);
        params.append('grant_type', 'authorization_code');
        params.append('client_secret', `${process.env.MICROSOFT_CLIENT_SECRET}`);

        const { access_token } = await (await axios.post(`${process.env.MICROSOFT_HOST}/common/oauth2/v2.0/token`, params)).data;
        return res.send({token: access_token})
    }
    catch (e: any) {
        return res.status(401).send({message: e.message})
    }
  }
}
