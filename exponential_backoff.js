// Setup
// Replicating a server with a 30% failure rate

const randomlyFail = (resolve, reject) =>
  Math.random() < 0.3 ? reject() : resolve();

// The apiCall function mimics the behavior of callling an endpoint on a server

const apiCall = () =>
  new Promise((...args) => setTimeout(() => randomlyFail(...args), 1000));


// Jitter
// building a jitter function to randomize the backoff period between .5 and 1.5 seconds

let jitter = function getRandomJitter(min, max) {
    return Math.random() * (max - min) + min;
}

// Delay
// When the server is failing we will add a randomized delay period before trying again

const delay =() =>
  new Promise(resolve => setTimeout(resolve, getRandomJitter(500, 1500)));

// Retrying
// When the apiCall is rejected, getResources is called again

const getResource = async (retryCount = 0, lastError = null) => {
    // Adding an iterator to keep track of attempts for a criteria for giving up
    
    if (retryCount > 5) throw new Error(lastError);
    // Error will be propagated after final attempt

    try {
      return apiCall();
    } catch (e) {
      await delay();   
      return getResource(retryCount + 1, e);
    }
  };






