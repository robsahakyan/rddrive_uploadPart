import styles from '../components/styles/uploadPart.module.css'
import { FiUpload } from 'react-icons/fi'
import { useRef, useState } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import { clearToken, getToken } from '../shared/cookiesService';
import { Success } from '../components/success';
import { Loader } from '../components/loader';
import axios from 'axios';
import { checkUrlValidity } from '../utils';
import { useRouter } from 'next/router';
import { ErrorComponent } from '../components/error';

export default function UploadPart({token}: {token: string}) {
    const router = useRouter();
    const [isFetching, setToFetching] = useState(false);
    const [isReadyResult, setResult] = useState(false);
    const [error, setError] = useState<string>('');
    const [urlIsReadyForSend, setForSend] = useState(false)
    const [getFile,  setFile] = useState<Array<File> | null>(null)
    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputUrlRef = useRef(null);

    const clickOnTheInputFile = () => {
        return inputFileRef.current?.click();
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const sendHandler = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        try {
            setToFetching(true)
            getFile?.map(async (el: File) => {
                let fileAsBinary = await fileReaderFunc(el);
                await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/myNewFolder/${el?.name}:/content`, fileAsBinary , config);
                setToFetching(false)
                setResult(true)
            })
        }
        catch (e: any) {
            setToFetching(false)
            setError(e.message)
        }
    }

    const fileInputHandler = async (e: React.SyntheticEvent<EventTarget>) => {
        const files: File[] = Array.from((e.target as HTMLFormElement).files)
        setFile(files)
               
    }

    const fileReaderFunc = (file: File) => {
        return new Promise((resolve,reject) => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                
                resolve(fileReader.result)
            }
            fileReader.readAsBinaryString(file)
        })
    }

    const cancelUploadHandler = () => {
        setFile(null);
    }

    const dragOver = (e: React.SyntheticEvent<EventTarget>) => {
        (e.target as HTMLFormElement).draggable = true;
        e.preventDefault()

    };
    
    const dragLeaveHandler = (e: React.SyntheticEvent<EventTarget>) => {
        (e.target as HTMLFormElement).draggable = false;
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        let arr: File[] = [];
        if (e.dataTransfer.items) {
            [...e.dataTransfer.items as any].forEach((item, i) => {
              if (item.kind === 'file') {
                const file = item.getAsFile();
                arr.push(file);
              }
            });
          } else {
            [...e.dataTransfer.files as any].forEach((file, i) => {
              arr.push(file);
            });
          }
        setFile(arr);  
    }

    const urlInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if ((e.target as HTMLInputElement).value.trim()) {
            setForSend(true)
        } else {
            setForSend(false)
        }
        
    }

    const sendUrlFileHandler = async (e: React.MouseEvent<HTMLElement>) => {
        let url = (e.target as HTMLFormElement).form[2].value;
        if (!checkUrlValidity(url)) {
           return setError('Invalid url passed!')
        }
        try {
            setToFetching(true)

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(url)
            let filename = url.substring(url.lastIndexOf('/')+1)
            await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/myNewFolder/${filename}:/content`, data , config)

            setToFetching(false)
            setResult(true)
            
        } catch (e: any) {
            setError(e.message)
        }
    }

    const signOutHandler = () => {
        clearToken();
        router.replace('/');
    }

    return (
    <> {
        error ?
        <ErrorComponent error={error}/> :
        isReadyResult ? 
        <Success /> :
        isFetching ?
        <Loader /> :
        <>
            <form className={styles.uploadPage} onSubmit={submitHandler}>
                {getFile?.length ?
                        <>
                            <div className={styles.fileNamePart}>
                                File(s)
                                <>
                                    {getFile.map((el: File, i: number, arr) => {
                                        return (
                                            <div className={styles.files} key={i}>
                                                <div className={styles.fileAbout}>
                                                type: {el.type}
                                                </div>
                                                <div className={styles.fileAbout}>
                                                name: {el.name}
                                                </div>
                                            </div>
                                        )
                                       
                                    })}
                                </>
                               
                                <div className={styles.buttonsDiv}>
                                    <button onClick={cancelUploadHandler} className={styles.cancelUploadButton}>
                                        Cancel upload
                                    </button>
                                    <button type='submit' onClick={sendHandler} className={styles.submitButton}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </> :
                        <>
                    <div className={styles.uploadPart}
                      onDragOver={dragOver}
                      onDragLeave={dragLeaveHandler}
                      onDrop={dropHandler}
                      >
                        <div className={styles.uploadDescription}>
                            Upload a file(s) or drop it here.
                        </div>
                        <div className={styles.uploadButtonPart}>
                            <input
                                    type="file"
                                    accept="/*"
                                    multiple
                                    ref={inputFileRef}
                                    onChange={fileInputHandler}
                                    style={{ display: "none" }}>
                                </input>
                            <button 
                                className={styles.uploadButton} 
                                onClick={clickOnTheInputFile}
                            >
                            <FiUpload/>
                            Choose File
                            </button> 
                        </div>
                    </div>
                    <div className={styles.shareUrlPart}>
                        <div className={styles.urlDesc}>
                            Or put a url here
                        </div>
                        <div className={styles.urlInputPart}>
                            <input type='text' className={styles.urlText} ref={inputUrlRef} onChange={urlInputHandler}/>
                            {urlIsReadyForSend && 
                            <button onClick={sendUrlFileHandler}>
                                Send
                            </button> 
                            }
                        </div>
                    </div>
                </> }
            </form>
            <div>
                <button onClick={signOutHandler} className={styles.signOutButton}>
                    Log out
                </button>
            </div>
        </>
        }
    </>
    )
}


export async function getServerSideProps({ req, res }: {req: NextApiRequest, res: NextApiResponse}) {
    let token = getToken({ req, res });

    if (!token) {
        return {
            redirect: {
              destination: '/',
              permanent: false,
            },
        }
    }

    return {
        props: {
            token: token
        }
    }
}