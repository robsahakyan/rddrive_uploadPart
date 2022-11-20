export function startAuth(url: string) {
    const width = 600,height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
  
    return window.open(url, '', // Open window to server side
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
            scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
            height=${height}, top=${top}, left=${left}`
    )
  }

export function checkUrlValidity(url: string) {
  try {
    new URL(url);
    return true;
  }
  catch (e) {
    return false
  }

}