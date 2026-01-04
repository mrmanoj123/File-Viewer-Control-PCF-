export const fileReordermove = (file: File[] | FileList, action: string, currentid: number, nextmove: number): File[] | FileList => {
    const currentfiles = Array.from(file)
    console.log(currentid, nextmove)
    console.log('before Drag : ', currentfiles);
    const forwardeditem = currentfiles[currentid]
    console.log('forwarded item ', forwardeditem)
    const backwarditem = currentfiles[nextmove]
    console.log('backwarditem', backwarditem)
    currentfiles[nextmove] = forwardeditem
    currentfiles[currentid] = backwarditem;
    //console.log(currentfiles)
    return currentfiles
}

export const fileReorderdown = (file: File[] | FileList, currentid: number): File[] | FileList => {
    const currentfiles = Array.from(file);
    //1->2
    const currentitem = currentfiles[currentid]; //1 st index value
    const nextitem = currentfiles[currentid + 1]; // 2nd index value

    currentfiles[currentid] = nextitem;
    currentfiles[currentid + 1] = currentitem

    return currentfiles


}