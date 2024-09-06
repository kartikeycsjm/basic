'use client'
import React, { useState } from 'react'
import * as tf from '@tensorflow/tfjs';

const Page = () => {
  const [temperature, setTemperature] = useState('');
  const [predictedPrice, setPredictedPrice] = useState(null);

  // Max values for normalization (based on your training data)
  const maxTemperature = 40;  // Max temperature in the dataset
  const maxPrice = 90;        // Max price in the dataset

  // Build the model
  const buildModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({
      units: 1,
      inputShape: [1]
    }));
    model.compile({
      optimizer: tf.train.sgd(0.01), // Stochastic Gradient Descent optimizer
      loss: 'meanSquaredError'
    });
    return model;
  };

  // Train the model
  const trainModel = async (model, xs, ys) => {
    const history = await model.fit(xs, ys, {
      epochs: 500,
      callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
      }
    });
    console.log('Model training complete');
  };

  // Predict the ice cream price based on temperature
  const predictPrice = async (model, temperature) => {
    const tempNum = Number(temperature);
    if (isNaN(tempNum)) {
      console.error('Invalid temperature input');
      return;
    }

    // Normalize the input temperature
    const normalizedTemp = (tempNum-20) / (maxTemperature-20);

    const tensor = tf.tensor2d([normalizedTemp], [1, 1]);
    const prediction = model.predict(tensor);
    
    const predictionArray = await prediction.array();

    // Denormalize the predicted price
    const denormalizedPrice = predictionArray[0][0] * maxPrice;
    setPredictedPrice(denormalizedPrice); // Set the predicted price
  };

  // Run the whole process
  const run = async () => {
    // Normalize the training data
    const xs = tf.tensor2d([20, 25, 30, 35, 40].map(val => (val-20) / (maxTemperature-20)), [5, 1]);
    const ys = tf.tensor2d([50, 60, 70, 80, 90].map(val => (val-50) / (maxPrice-50)), [5, 1]);

    const model = buildModel();

    // Train the model
    await trainModel(model, xs, ys);

    // Predict the price based on the input temperature
    await predictPrice(model, temperature);
  };

  return (
    <div className='w-[300px] h-[300px] bg-red-400'>
      <input
        type="number"
        placeholder="Enter temperature in °C"
        className='p-2 text-blue-700'
        value={temperature}
        onChange={e => setTemperature(e.target.value)}
      />
      <br />
      <button onClick={run} className='p-2 bg-black text-white'>Predict Ice Cream Price</button>
      <br />
      <p>Predicted Price: {predictedPrice !== null ? `${predictedPrice.toFixed(2)} units` : 'Enter a temperature and click Predict'}</p>
    </div>
  );
}

export default Page;
