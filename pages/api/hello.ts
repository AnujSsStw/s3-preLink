// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";

const s3 = new S3({
  apiVersion: "2006-03-01",
  region: process.env.REGION,
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  signatureVersion: "v4",
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const extension = (req.query.fileType as string).split("/")[1];
  const Key = `${randomUUID()}.${extension}`;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    Expires: 60,
    ContentType: `image/${extension}`,
  };

  const uploadURL = s3.getSignedUrl("putObject", s3Params);
  res.status(200).json({
    uploadURL,
    key: Key,
  });
}
