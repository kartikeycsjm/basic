import * as tf from '@tensorflow/tfjs';

import React from 'react'

const page = () => {
    const data = [
        { area: 2100, bedrooms: 3, price: 400000 },
        { area: 1600, bedrooms: 2, price: 330000 },
        { area: 2400, bedrooms: 4, price: 450000 },
        { area: 1416, bedrooms: 2, price: 232000 },
        { area: 3000, bedrooms: 4, price: 540000 }
      ];
    
      // Separate the features (area, bedrooms) and labels (price)
      const features = data.map(item => [item.area, item.bedrooms]);
      const labels = data.map(item => item.price);
    
      // Convert to tensors
      const featureTensor = tf.tensor(features);
      const labelTensor = tf.tensor(labels);
    
      console.log("Feature Tensor:", featureTensor.toString());
      console.log("Label Tensor:", labelTensor.toString());
    
      // Normalize the feature tensor (min-max scaling between 0 and 1)
      const areaMin = Math.min(...features.map(f => f[0]));
      const areaMax = Math.max(...features.map(f => f[0]));
      const bedroomsMin = Math.min(...features.map(f => f[1]));
      const bedroomsMax = Math.max(...features.map(f => f[1]));
    
      const normalizedFeatures = featureTensor.sub([areaMin, bedroomsMin])
        .div([areaMax - areaMin, bedroomsMax - bedroomsMin]);
    
      console.log("Normalized Features:", normalizedFeatures.toString());
    return (
        <div>page</div>
    )
}

export default page