

export const filetypecheck = (fileTypes: string[], userfiletype: string) => {
    console.log(userfiletype, fileTypes, fileTypes.length > 1)

    //const userselfiles = fileTypes
    // const result = fileTypes.length > 1 ? fileTypes.filter((element) => {
    //     return element !== userfiletype
    // }).length > 0 : fileTypes.filter((ele) => {
    //     return ele !== userfiletype
    // }).length > 0
    const result = fileTypes.filter((element) => {
        return element !== userfiletype
    }).length > 0

    return result

}

export const filesize = (fileinformation: number[]) => {
    const _indivudialfileLimit = 5 * 1024 * 1024
    console.log(_indivudialfileLimit, fileinformation)
    const indivudialcheck = fileinformation.filter((ele, index) => {
        return ele > _indivudialfileLimit
    }).length > 0 ? 'one file size is exceed more than 5mb' : 'false';

    return indivudialcheck

}


export const totalsize = (fileinformation: number[]) => {
    const _Totalfilecheck = 10 * 1024 * 1024
    const sizes = fileinformation.map((ele, index) => {
        return ele
    })
    const TotalFileSizes = sizes.reduce((a, b) => a + b, 0) > _Totalfilecheck ? 'All the files Size limit Should be within 10mb' : 'false'
    return TotalFileSizes
}

export const numberoffilesupload = (filesize: File[], definedsize: number) => {
    const res = filesize.length > definedsize
    return res
}