import { Storage } from '@google-cloud/storage';
import { ReadStream } from 'fs';

export class GCSProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage(); 
    this.bucketName = process.env.GCS_BUCKET_NAME as string;
  }

  async uploadFile(stream: ReadStream, destination: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destination);

    return new Promise((resolve, reject) => {
      stream
        .pipe(file.createWriteStream({ resumable: false }))
        .on('finish', () => resolve(`https://storage.googleapis.com/${this.bucketName}/${destination}`))
        .on('error', reject);
    });
  }
}