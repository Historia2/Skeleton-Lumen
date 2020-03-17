import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Popup} from 'components/structure';
import {dateFormater} from 'components/helper';
import {IoIosClose} from 'react-icons/io';
import {hideProfile} from 'actions/dashboard.action';
import {useDropzone} from 'react-dropzone';
import {Base64} from 'js-base64';
import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {HTTP_CONFIG, MAP_DEV, localUrl} from '../../../services/config';
import axios from 'axios';
import image2base64 from 'image-to-base64';
import {Loading} from 'components/structure';
import SuccessAnimation from "../../../components/structure/success-animation.component";
import ErrorAnimation from "../../../components/structure/error-animation.component";

const picture = require('assets/images/picture.jpg');

const dropZone = {
    border: '1px dotted #d3d3d3',
    padding: '10px',
    height: '200px',
    display: 'flex'
};
const dropZoneText = {
    textAlign: 'center',
    margin: 'auto',
};
const displayNone = {
    dislpay: 'none !important'
};
const displayBlock = {
    display: 'block !important'
};

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ImageBlobUrl: '',
            imageName: '',
            base64Image: '',
            crop: {
                unit: "%",
                width: 50,
                height:50
            },
            isVerified: true,
            showVerificationForm: false,
            imageExists: false,
            sizeTooSmall: false,
            croppedImageUrl: false,
            isLoading: false,
            isError: false,
            isSuccess: false,
            progressMessage: 'Please wait..'
        };
        this.setBase64 = this.setBase64.bind(this);
        this.showUploadForm = this.showUploadForm.bind(this);
        this.verifyKtp = this.verifyKtp.bind(this);
        this.countStringByte = this.countStringByte.bind(this);
        this.resetLoadingProfile = this.resetLoadingProfile.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
    }

    countStringByte(str) {
        //http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
        var ch, st, re = [], j = 0;
        for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            if (ch < 127) {
                re[j++] = ch & 0xFF;
            } else {
                st = [];    // clear stack
                do {
                    st.push(ch & 0xFF);  // push byte to stack
                    ch = ch >> 8;          // shift value down by 1 byte
                }
                while (ch);
                // add stack contents to result
                // done because chars have "wrong" endianness
                st = st.reverse();
                for (var k = 0; k < st.length; ++k)
                    re[j++] = st[k];
            }
        }
        // return an array of bytes
        return re;
    }

    verifyKtp = async () => {
        const {croppedImageUrl} = this.state;
        this.setState({
            isLoading: true,
            imageExists: false
        });
        let file = await image2base64(croppedImageUrl)
            .then(
                (response) => {
                    return response;
                }
            );

        axios.post(MAP_DEV.ocr, {
            file: file,
            user_id: localStorage.getItem('plainUserId'),
            file_name: this.state.imageName
        }, HTTP_CONFIG).then((result) => {

            localStorage.setItem('verified', 1);

            return this.setState({
                progressMessage: 'Success, your account has been verified',
                imageExists: false,
                isSuccess: true,
                isError: false,
                isVerified:true
            });

        }).catch((e) => {
            if (e.status === 400) {
                return this.setState({
                    progressMessage: 'This ID has been registered, please use Another ID!',
                    imageExists: true,
                    isError: true,
                    isLoading: true,
                    isSuccess: false
                });
            } else {
                return this.setState({
                    progressMessage: 'Error! Something happened, please try again.',
                    imageExists: true,
                    isError: true,
                    isLoading: true,
                    isSuccess: false
                });
            }
        })
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                this.state.imageName
            );
            this.setState({croppedImageUrl});
            let file = await image2base64(croppedImageUrl);
            let croppedSize = this.countStringByte(file).length / 1000;

            this.setState({
                sizeTooSmall: false
            });

            if (croppedSize < 76) {
                this.setState({
                    sizeTooSmall: true
                })
            }
        }
    }

    onImageLoaded = image => {
        this.imageRef = image;
    };

    setBase64(values, name) {
        this.setState({
            ImageBlobUrl: values,
            imageExists: true,
            base64Image: Base64.encode(values),
            imageName: name
        })
    }

    showUploadForm() {
        this.setState({
            showVerificationForm: true
        })
    }

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({crop});
    };

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    componentDidMount() {
        let verified = localStorage.getItem('verified');
        if (verified != 0) {
            this.setState({
                isVerified: true
            });
        }
    }

    resetLoadingProfile() {
        return this.setState({
            isLoading:false,
            imageExists: false,
            isSuccess: false,
            isError: false
        });
    }

    reloadPage() {
        window.location.reload();
    }

    render() {
        const {isProfileOpen, hideProfile} = this.props;
        const {ImageBlobUrl, crop, croppedImageUrl, isVerified, showVerificationForm, imageExists, sizeTooSmall, isLoading, isError, isSuccess, progressMessage} = this.state;

        return (
            <Popup id={imageExists ? 'empty' : "profileCard"}
                   modalDialogStyle={isLoading ? {maxWidth: 'fit-content'} : false} isOpen={isProfileOpen}
                   backdrop="static">
                {
                    <div>
                        {
                            isLoading ?
                                <div className={"loading-container text-center"}>
                                    {
                                        isSuccess ? <div>
                                                <IoIosClose style={{position: 'absolute', top: '0', right: '0'}}
                                                            className="close" title="Close" onClick={() => { hideProfile(); this.reloadPage() } } />
                                                <SuccessAnimation/>
                                            </div> :
                                            isError ?
                                                <div>
                                                    <IoIosClose
                                                        style={{position: 'absolute', top: '-15px', right: '0px'}}
                                                        className="close" title="Close" onClick={() => { hideProfile(); this.resetLoadingProfile() }}/>
                                                    <ErrorAnimation/>
                                                </div>
                                                : <Loading loaderStyle={{height: '100px'}}
                                                           loadingStyle={{margin: '0 auto'}}
                                                           logo={"false"}/>
                                    }
                                    <span> {progressMessage} </span>
                                </div>
                                :
                                <div className={"content"}>
                                    <div className={"row"}>
                                        <div className={"col-12"}>
                                            <IoIosClose style={{
                                                right: '0px',
                                                top: '-15px'
                                            }} className="close" title="Close" onClick={() => { hideProfile(); this.resetLoadingProfile() }}/>
                                            {
                                                showVerificationForm ?
                                                    <Previews
                                                        styles={false}
                                                        preview={true} display={imageExists}
                                                        label={"Drag 'n' drop some files here, or click to select files"}
                                                        setBase={(values, name) => this.setBase64(values, name)}/>
                                                    : <ProfileComponent baseUrl = { localUrl } />
                                            }
                                        </div>
                                    </div>
                                    {
                                        imageExists ?
                                            <div className={"row"}>
                                                <div className={"col-12"}>
                                                    <h6> Please crop your image </h6>
                                                </div>
                                                <div className={"col-8"}>
                                                    <ReactCrop
                                                        src={ImageBlobUrl}
                                                        crop={crop}
                                                        onImageLoaded={this.onImageLoaded}
                                                        onComplete={this.onCropComplete}
                                                        onChange={this.onCropChange}
                                                    />
                                                </div>
                                                <div className={"col-4 image-preview"}>
                                                    <div className={"image-preview-container"}>
                                                        {croppedImageUrl && (
                                                            <img alt="Crop" style={{
                                                                maxWidth: "100%",
                                                                width: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                                 className={"img-fluid"} src={croppedImageUrl}/>
                                                        )}
                                                    </div>
                                                    <sub> Preview - {sizeTooSmall ?
                                                        <span
                                                            className={"text-danger"}> Cropped size too small! </span> : ''} </sub>
                                                    <Previews
                                                        styles={{
                                                            border: '1px dotted rgb(211, 211, 211)',
                                                            padding: '10px',
                                                            height: '130px',
                                                            display: 'flex',
                                                            margin: '5px 0',
                                                            marginLeft: '-15px'
                                                        }}
                                                        preview={false}
                                                        label={"Drag 'n' drop file here to change image"}
                                                        setBase={(values, name) => this.setBase64(values, name)}/>
                                                </div>
                                            </div> : ''
                                    }
                                    {
                                        isVerified ?
                                            <span/>
                                            :
                                            <div>
                                                {
                                                    imageExists ?
                                                        <div>
                                                            <hr/>
                                                            <button className={"btn btn-primary"}
                                                                    disabled={(!croppedImageUrl || sizeTooSmall)}
                                                                    onClick={() => this.verifyKtp()}> Upload & Verify
                                                            </button>
                                                        </div>
                                                        : <div>
                                                            <hr/>
                                                            <span> Verified your account by uploading you id <a
                                                                href={"javascript:void(0)"}
                                                                onClick={() => this.showUploadForm()}> here </a> </span>
                                                        </div>

                                                }
                                            </div>
                                    }
                                </div>
                        }
                    </div>
                }
            </Popup>
        )
    }
}

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};


function Previews(props) {
    const [files, setFiles] = useState([]);
    const {setBase, display, label, preview, styles} = props;
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            if (acceptedFiles.length > 0) {
                setBase(acceptedFiles[0].preview, acceptedFiles[0].name);
            }
        }
    });

    const thumbs = files.map(file => {
        return (
            <div style={thumb} key={file.name}>
                <div style={thumbInner}>
                    <img
                        src={file.preview}
                        style={img}
                    />
                </div>
            </div>
        )
    });

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className={("container-fluid " + (display ? 'd-none' : 'd-block'))}>
            <div style={styles ? styles : dropZone} {...getRootProps({className: 'dropzone'})}>
                <div className={"dropzone-text"} style={dropZoneText}>
                    <input {...getInputProps()} />
                    <p>{label}</p>
                    <FontAwesomeIcon title={"download invoice"} className={"download-invoice"} icon={faDownload}/>
                </div>
            </div>
            {
                preview
                    ? <aside style={thumbsContainer}>
                        {thumbs}
                    </aside>
                    : ''
            }
        </section>
    );
}

const UploadKtpComponent = () => {

}

const ProfileComponent = ({
                              baseUrl
                          }) => {
    return (
        <div>
            <div className="profile-card">
                <div className="picture">
                    <img src={picture} alt="T"/>
                </div>
                <div className="description">
                    <div className="username">{localStorage.getItem('username')}</div>
                    <div className="email">{localStorage.getItem('email')}</div>
                    <div className="company">{localStorage.getItem('company') || "Personal User"}</div>
                    <div className="status">
                        <div className="flag">Subscribed until {dateFormater(localStorage.getItem('subsDate'))}</div>
                    </div>
                    <hr/>
                    <span>
                            Extends your Subscription <a rel="noopener noreferrer"
                                                         href={baseUrl + 'dashboard/subscription'}>here</a>
                        </span>
                </div>
                <div className="offer">

                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isProfileOpen: state.dashboardReducer.isProfileOpen
})

const mapDispatchToProps = dispatch => ({
    hideProfile: () => dispatch(hideProfile())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
