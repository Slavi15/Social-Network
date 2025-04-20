declare module 'imgbb-uploader' {
    interface ImgBBOptions {
        apiKey: string;
        base64string?: string;
        name?: string;
        expiration?: number;
    }

    interface ImgBBResponse {
        id: string;
        title: string;
        url: string;
        delete_url: string;
    }

    function imgbbUploader(options: ImgBBOptions): Promise<ImgBBResponse>;

    export = imgbbUploader;
}