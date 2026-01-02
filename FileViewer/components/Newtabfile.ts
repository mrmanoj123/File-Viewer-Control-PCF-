export const newtabrender = (base64: string, chunksize: number, filetype: string): Blob => {
    const [mimetype, b64code] = base64.split(',');
    console.log(mimetype)
    const mime = mimetype.split('/')[1].split(';')[0]
    //data:application/pdf;base64
    const bytesarray: ArrayBuffer[] = []

    for (let currentvalue = 0; currentvalue < b64code.length; currentvalue += chunksize) {
        const slice = b64code.slice(currentvalue, chunksize + currentvalue)

        const decode = atob(slice)

        const bytelength = new Uint8Array(decode.length)

        for (let i = 0; i < bytelength.length; i++) {
            bytelength[i] = decode.charCodeAt(i);
        }

        bytesarray.push(bytelength.buffer)
    }
    return new Blob(bytesarray, { type: filetype })

}