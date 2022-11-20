import axios from "axios"
import { useRouter } from "next/router";
import { setToken } from "../shared/cookiesService";

export default function Auth(props: any) {
    const router = useRouter()
    if (props.token) {
        setToken(props.token);
        if (typeof window !== 'undefined') {
            router.replace('/');
        }
    }
    
    return (
    <div>
    </div>)
}

export async function getServerSideProps(context: any) {
    let token: string = '';
    let code = context.query?.code;
    if (code) {
        let body = {code: code};
        let result = await axios.post(`${process.env.HOST}/api`, body);
        token = result.data.token;
    }
    return {
        props: {
            code: context.query.code,
            token: token
        }
    }
}