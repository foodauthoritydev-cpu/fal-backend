const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const {
  B2_KEY_ID,
  B2_APPLICATION_KEY,
  B2_BUCKET_NAME,
  B2_BUCKET_REGION,
  B2_PUBLIC_ENDPOINT
} = process.env

const normalizeEndpoint = (endpoint) => {
  if (!endpoint) return null
  let url = endpoint.trim().replace(/\/$/, '')
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }
  return url
}

const s3 = new S3Client({
  endpoint: normalizeEndpoint(B2_PUBLIC_ENDPOINT) || `https://s3.${B2_BUCKET_REGION || 'us-east-005'}.backblazeb2.com`,
  region: B2_BUCKET_REGION || 'us-east-005',
  credentials: {
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY
  }
})

const buildPublicUrl = (key) => {
  const base = normalizeEndpoint(B2_PUBLIC_ENDPOINT) || `https://s3.${B2_BUCKET_REGION || 'us-east-005'}.backblazeb2.com`
  return `${base}/${B2_BUCKET_NAME}/${key}`
}

const sanitizeKey = (filename) => {
  const safe = String(filename || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '-').replace(/-+/g, '-')
  return `${Date.now()}-${safe}`
}

const uploadFile = async (buffer, originalName, contentType, folder = 'uploads') => {
  const key = `${folder}/${sanitizeKey(originalName)}`

  await s3.send(new PutObjectCommand({
    Bucket: B2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream'
  }))

  return { url: buildPublicUrl(key), key }
}

const deleteFile = async (url) => {
  if (!url) return
  try {
    const base = normalizeEndpoint(B2_PUBLIC_ENDPOINT) || `https://s3.${B2_BUCKET_REGION || 'us-east-005'}.backblazeb2.com`
    const prefix = `${base}/${B2_BUCKET_NAME}/`
    if (!url.startsWith(prefix)) return
    const key = url.substring(prefix.length)
    await s3.send(new DeleteObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key
    }))
  } catch (error) {
    console.error('Failed to delete B2 file:', error.message)
  }
}

module.exports = { uploadFile, deleteFile, s3 }
