import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { filetypecheck, filesize, totalsize, numberoffilesupload } from "./components/filechecks"
import { newtabrender } from './components/Newtabfile'
interface fileinformationstore {
    name: string;
    type: string;
    size: number;
    lastModified: Date;
    base64: string
}

export class FileViewer implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // Main container & notify
    private container!: HTMLDivElement;
    private notifyOutputChanged!: () => void;

    // HTML elements
    private fileinput!: HTMLInputElement;
    private filenames!: HTMLSpanElement;
    private button!: HTMLButtonElement;
    private filenamesrender!: HTMLDivElement;
    private preview: HTMLButtonElement;
    private delete: HTMLButtonElement;
    private viewer: HTMLIFrameElement;
    private errormessagespan: HTMLSpanElement

    // Bound values
    private allowMultipleFiles = false;
    private fileTypes = "";
    private maxFilesAllowed = "";
    private allFileNames = "";
    private numberoffiles: number;
    private bas64: string[] = []
    private currentbase64 = ""
    private allfile: File[] = []
    private allfileinformation: fileinformationstore[]
    private processstring: string;
    private errormessage = ''
    private typecheck = false
    private singlefilecheck = "false";
    private Allfilecheck = "false";
    private numberoffilescheck = false;
    private previewmode: string;
    private filetype: string;

    /* ================= INIT ================= */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        // Root container styling
        this.container.classList.add("fileviewer-container");

        /* ---------- File input ---------- */
        this.fileinput = document.createElement("input");
        this.fileinput.type = "file";
        this.fileinput.className = "fileviewer-input";
        this.viewer = document.createElement('iframe')
        this.errormessagespan = document.createElement('span')


        //this.viewer.style.display = 'block'

        this.fileinput.onchange = async (e: Event) => {
            const input = e.target as HTMLInputElement;
            const files = input.files ? Array.from(input.files) : [];
            const userfiles = files.map((element) => { return element.type.split('/')[1] })
            const sizes = files.map((ele) => { return ele.size })
            //console.log(userfiles, files.length, this.maxFilesAllowed)


            this.typecheck = filetypecheck(userfiles, this.fileTypes)
            this.singlefilecheck = filesize(sizes)
            this.Allfilecheck = totalsize(sizes)
            this.numberoffilescheck = numberoffilesupload(files, parseInt(this.maxFilesAllowed))
            //console.log(typecheck, singlefilecheck, Allfilecheck, numberoffilescheck)
            if (this.typecheck || this.singlefilecheck !== 'false' || this.Allfilecheck !== 'false' || this.numberoffilescheck) {
                if (this.typecheck) {
                    this.errormessage = `You have selected ${this.fileTypes}. Please upload only these file types for the process.`
                    console.log(this.errormessage)
                } else {
                    if (this.singlefilecheck !== 'false' || this.Allfilecheck !== 'false') {
                        this.errormessage = 'The uploaded individual files exceed the size limit. Please upload compressed files.'
                    } else {
                        if (this.numberoffilescheck) {
                            this.errormessage = `You have selected ${this.maxFilesAllowed} files. Please upload only the required number of files.`
                        }
                        this.errormessage = 'Something went wrong , Please try again'
                    }
                }
                this.notifyOutputChanged()
                return;
                // alert('File Type Mismatch. Please upload valid files')
            }
            else {
                this.renderfiles(files)
                this.allfileinformation = []; // reset
                files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = reader.result as string;
                        const currentfileinfo: fileinformationstore = {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            lastModified: new Date(file.lastModified),
                            base64: base64
                        };
                        this.allfileinformation.push(currentfileinfo);
                        console.log(this.allfileinformation);
                        // notify AFTER data is ready
                        this.notifyOutputChanged();
                    };
                    reader.onerror = () => {
                        console.error("File read error:", file.name);
                    };
                    reader.readAsDataURL(file);
                });
            }

        };


        /* ---------- Upload button ---------- */
        this.button = document.createElement("button");
        this.button.textContent = "Upload File";
        this.button.className = "fileviewer-button";
        this.button.onclick = () => this.fileinput.click();

        /* ---------- File names label ---------- */
        this.filenames = document.createElement("span");
        this.filenames.className = "fileviewer-label";
        this.filenames.innerText = "Number of Selected Files: None";




        // Append to DOM
        this.container.appendChild(this.fileinput);
        this.container.appendChild(this.button);
        this.container.appendChild(this.errormessagespan)
        this.container.appendChild(this.filenames);
        // Append child inside parent

    }

    /* ================= UPDATE VIEW ================= */
    public updateView(context: ComponentFramework.Context<IInputs>): void {

        this.allowMultipleFiles = context.parameters.uploadmultiplefiles?.raw ?? false;
        this.fileTypes = context.parameters.Filetypes?.raw ?? "";
        this.maxFilesAllowed = context.parameters.maxFiles?.raw ?? "1";

        this.fileinput.multiple = this.allowMultipleFiles;

        this.filenames.innerText = this.allFileNames
            ? `Number of Selected Files: ${this.numberoffiles}`
            : "Number of Selected Files: None";


        //console.log(this.singlefilecheck, this.Allfilecheck, this.numberoffiles, this.typecheck)

        if (this.typecheck || this.singlefilecheck !== 'false' || this.Allfilecheck !== 'false' || this.numberoffilescheck) {
            this.errormessagespan.innerText = `Error : ${this.errormessage}`
            this.errormessagespan.style.color = 'red'
            // alert('File Type Mismatch. Please upload valid files')
        } else {
            this.errormessagespan.innerText = ''

        }
        this.previewmode = context.parameters.PreviewType?.raw ?? 'inline'

        if (this.filenamesrender && !this.container.contains(this.filenamesrender)) {
            this.container.appendChild(this.filenamesrender);
        }
        if (this.bas64.length > 0 && this.previewmode !== 'new tab') {
            this.renderiframecomponent()
        }


    }

    /* ================= OUTPUTS ================= */
    public getOutputs(): IOutputs {
        return {
            FileNames: this.allFileNames,
            // selectedfilebase64: this.currentbase64
            Fileinformation: JSON.stringify(this.allfileinformation),
            ErrorMessage: this.errormessage
        };
    }

    /* ================= DESTROY ================= */
    public destroy(): void {
        // Cleanup if required
    }

    private base64(inputfile: File) {
        if (!inputfile) {
            return "";
        } else {
            const Reader = new FileReader()
            Reader.onload = () => {
                this.currentbase64 = Reader.result as string
                this.filetype = inputfile.type
                this.bas64.push(Reader.result as string)
            }
            Reader.onerror = () => {
                console.log('File Error')
            }
            Reader.readAsDataURL(inputfile)
        }
    }

    private Deletefile(file: File) {
        // this.allfile = this.allfile.filter((ele) => {
        //     return ele !== file
        // })

        if (this.allfile.length === 1) {
            alert('Atleast one file Mandatory')
        } else {
            const newdata: File[] = this.allfile.filter((ele) => {
                return ele !== file
            })

            console.log(newdata);
            this.renderfiles(newdata)
            this.notifyOutputChanged()
        }
    }

    private renderfiles(e: FileList | File[]) {
        //const input = e.target as HTMLInputElement;
        const files = e instanceof FileList ? Array.from(e) : e;
        this.allfile = files
        this.numberoffiles = files.length
        this.allFileNames = files.map(f => f.name).join(", ");
        console.log(files)

        // Clear old render
        if (this.filenamesrender) {
            this.filenamesrender.remove();
        }

        // Render file list
        this.filenamesrender = document.createElement("div");
        this.filenamesrender.className = "fileviewer-list";

        this.allfile.forEach(file => {
            const row = document.createElement("div");
            row.className = "fileviewer-item";

            const name = document.createElement("div");
            const type = document.createElement("div");
            const size = document.createElement("div");
            this.preview = document.createElement('button');
            this.preview.textContent = ' Preview File'
            this.preview.className = 'preview'
            this.preview.onclick = () => {

                this.filepreview(file)

            }
            this.delete = document.createElement('button');
            this.delete.textContent = 'Delete File'
            this.delete.className = 'delete'
            this.delete.onclick = () => {
                this.Deletefile(file)

            }
            const lastModified = document.createElement("div");

            name.textContent = file.name;
            type.textContent = file.type || "unknown";
            size.textContent = `${(file.size / 1024).toFixed(1)} KB`;
            lastModified.textContent = new Date(file.lastModified).toLocaleDateString();

            name.className = "childview-item";
            type.className = "childview-item";
            size.className = "childview-item";
            lastModified.className = "childview-item";

            row.appendChild(name);
            row.appendChild(type);
            row.appendChild(size);
            row.appendChild(lastModified);
            row.appendChild(this.preview)
            row.appendChild(this.delete)

            this.filenamesrender.appendChild(row);
        });
        this.notifyOutputChanged();
    }
    private filepreview(file: File) {
        console.log(this.currentbase64)
        console.log(this.bas64);

        this.base64(file);
        if (this.previewmode === 'new tab') {
            const blob: Blob = newtabrender(this.currentbase64, 1024 * 1024, this.filetype)
            //const newblob = blob;
            const obj = URL.createObjectURL(blob)
            console.log(obj)
            window.open(obj, "_blank")
            URL.revokeObjectURL(obj);
            setTimeout(() => {
                URL.revokeObjectURL(obj)
            }, 5000)
        } else {
            this.renderiframecomponent()
        }

    }

    private renderiframecomponent() {
        if (this.bas64.length > 0 && this.previewmode !== 'new tab') {
            //console.log("file added", this.bas64)
            this.viewer.style.display = 'block'
            this.viewer.src = this.currentbase64
            this.viewer.style.width = "100%";
            this.viewer.style.height = "500px";
            this.viewer.style.border = "none";
            this.viewer.style.borderRadius = "8px";
            this.viewer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
            this.viewer.style.backgroundColor = "#fff";
            this.container.appendChild(this.viewer)
        } else {
            this.viewer.style.display = 'none'
        }
        //this.notifyOutputChanged()
    }
}
