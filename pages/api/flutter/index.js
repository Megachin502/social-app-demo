export default async function handler(req, res) {
  //
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': process.env.MONGODB_DATA_API_KEY,
    },
  }
  const fetchBody = {
    dataSource: process.env.MONGODB_DATA_SOURCE,
    database: 'social_butterfly',
    collection: 'flutters',
  }
  const baseUrl = `${process.env.MONGODB_DATA_API_URL}/action`

  //Setting up endpoints
  try {
    switch (req.method) {
      //find endpoint
      case 'GET':
        const readData = await fetch(`${baseUrl}/find`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            sort: { postedAt: -1 },
          }),
        })
        const readDataJson = await readData.json()
        res.status(200).json(readDataJson.documents)
        break
      //insertOne endpoint
      case 'POST':
        const flutter = req.body
        const insertData = await fetch(`${baseUrl}/insertOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            document: flutter,
          }),
        })
        const insertDataJson = await insertData.json()
        res.status(200).json(insertDataJson)
        break
      //updateOne endpoint
      case 'PUT':
        const updateData = await fetch(`${baseUrl}/updateOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            filter: { _id: { $oid: req.body._id } },
            update: {
              $set: {
                body: req.body.body,
              },
            },
          }),
        })
        const updateDataJson = await updateData.json()
        res.status(200).json(updateDataJson)
        break
      //deleteOne endpoint
      case 'DELETE':
        const deleteData = await fetch(`${baseUrl}/deleteOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            filter: { _id: { $oid: req.body._id } },
          }),
        })
        const deleteDataJson = await deleteData.json()
        res.status(200).json(deleteDataJson)
        break

      //Default
      default:
        res.status(405).end()
        break
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}
