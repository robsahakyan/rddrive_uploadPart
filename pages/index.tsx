import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';
import { getToken } from '../shared/cookiesService'

export default function Home({url, token}: {url: string, token: any}) {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    if (url && !token) {
        window.location.href = url
    } else {
      router.push('/upload')
    }
  }
  
  return (
   <main>
   </main>
  )
}



export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
  const getUrl = await axios.get(`${process.env.HOST}/api/auth`);
  let token = getToken({req, res});
  
  return {
      props: {
          url: getUrl.data.url,
          token
      }
  }

}