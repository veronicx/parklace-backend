const loadData = require("./loadData");
const tf = require("@tensorflow/tfjs");

async function train() {
    // Load the data
    const dataset = await loadData('plate-recognition');

    // Create the TensorFlow tensors from the loaded data
    const trainImages = tf.stack(dataset.train.images);
    const trainLabels = tf.oneHot(tf.tensor1d(dataset.train.labels, 'int32'), 10);
    const validImages = tf.stack(dataset.valid.images);
    const validLabels = tf.oneHot(tf.tensor1d(dataset.valid.labels, 'int32'), 10);

    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [64, 64, 3],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

    // Compile the model
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Train the model
    const history = await model.fit(trainImages, trainLabels, {
        epochs: 10,
        validationData: [validImages, validLabels],
        batchSize: 32,
    });
    console.log(history)

    // Evaluate the model
    const evalOutput = model.evaluate(validImages, validLabels);
    console.log(`Accuracy: ${evalOutput[1].dataSync()[0]}`);

    // Make a prediction with a zero input tensor
    const predictions = model.predict(tf.zeros([1, 64, 64, 3])).argMax([-1]);
    console.log(`Prediction: ${predictions.dataSync()}`);
}

module.exports = train()
