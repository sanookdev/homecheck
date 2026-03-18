import { db } from '../config/firebase.js';
import cloudinary from '../config/cloudinary.js';

const COLLECTION_NAME = 'checklists';

// Utility buffer-to-stream uploader for cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'homecheck', resource_type: 'auto' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.write(buffer);
    stream.end();
  });
};

export const getChecklists = async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch checklists', details: error.message });
  }
};

export const createChecklist = async (req, res) => {
  try {
    const { title, description, status, price } = req.body;
    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      imageUrl = uploadResult.secure_url;
    }

    const newItem = {
      title,
      description: description || '',
      status: status || 'Pending',
      price: Number(price) || 0,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection(COLLECTION_NAME).add(newItem);
    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checklist', details: error.message });
  }
};

export const updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, price } = req.body;
    let updateData = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (price !== undefined) updateData.price = Number(price);

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      updateData.imageUrl = uploadResult.secure_url;
    }

    await db.collection(COLLECTION_NAME).doc(id).update(updateData);
    const updatedDoc = await db.collection(COLLECTION_NAME).doc(id).get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update checklist', details: error.message });
  }
};

export const deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION_NAME).doc(id).delete();
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete checklist', details: error.message });
  }
};
