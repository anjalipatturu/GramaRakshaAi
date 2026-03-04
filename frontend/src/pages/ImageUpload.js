import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ImageUpload = () => {
  const { uploadImage, loading } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageType, setImageType] = useState('rash');
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      const response = await uploadImage(selectedFile, imageType);
      setResult(response.image);
      toast.success('Image analyzed successfully');
    } catch (error) {
      toast.error('Error uploading image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-beige via-white to-soft-charcoal/5 py-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-forest-green mb-8 text-center">Image Analysis</h1>
          
          <div className="glass-panel rounded-2xl p-8">
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Select Image Type</label>
              <select
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-electric-teal focus:ring focus:ring-electric-teal/20"
              >
                <option value="rash">Rash</option>
                <option value="wound">Wound</option>
                <option value="swelling">Swelling</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-electric-teal transition-all">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <FaUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
              </label>
            </div>

            {preview && (
              <div className="mb-6">
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain rounded-xl" />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className="w-full px-6 py-3 bg-electric-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>

            {result && (
              <div className="mt-6 p-6 bg-sand-beige/50 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Analysis Result</h3>
                <p className="mb-2"><strong>Possible Issue:</strong> {result.analysis.possibleIssue}</p>
                <p className="mb-2"><strong>Confidence:</strong> {(result.analysis.confidence * 100).toFixed(0)}%</p>
                <p className="mb-4"><strong>Urgency:</strong> {result.analysis.urgencyLevel}</p>
                <div>
                  <strong>Advice:</strong>
                  <ul className="mt-2 space-y-1">
                    {result.analysis.advice.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm text-yellow-700">{result.disclaimer}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageUpload;
