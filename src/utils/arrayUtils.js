const months = [
    'January', 
    'February', 
    'March',
    'April', 
    'May', 
    'June',
    'July', 
    'August', 
    'September',
    'October', 
    'November', 
    'December',
];

export const shuffle = (array) => {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const sortByNumber = (array) => {
    return array.sort((a, b) => {
      // Extract the number part from the paths
      const numA = parseInt(a.match(/\/static\/media\/(\d+)\./)[1], 10);
      const numB = parseInt(b.match(/\/static\/media\/(\d+)\./)[1], 10);
  
      // Compare the numbers
      return numA - numB;
    });
}

export const sortByStartDate = (data) => {
    return data.sort((a, b) => {
      const startDateA = new Date(a.startDate.year, a.startDate.month - 1);
      const startDateB = new Date(b.startDate.year, b.startDate.month - 1);
      
      return startDateA - startDateB;
    });
}

export const sortByYear = (data) => {
    return data.sort((a, b) => {
      return b.graduation - a.graduation;
    });
}

export const displayMonth = (num) => months[num - 1];
  