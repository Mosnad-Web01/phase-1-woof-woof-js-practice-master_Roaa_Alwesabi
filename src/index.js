document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filterOn = false;
  
    // جلب بيانات الكلاب وعرضها في شريط الكلاب
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pups => {
        renderDogBar(pups);
      });
  
    // عرض أسماء الكلاب في شريط الكلاب
    function renderDogBar(pups) {
      dogBar.innerHTML = '';
      pups.forEach(pup => {
        const span = document.createElement('span');
        span.textContent = pup.name;
        span.addEventListener('click', () => showDogInfo(pup));
        dogBar.appendChild(span);
      });
    }
  
    // عرض معلومات الكلب المختار
    function showDogInfo(pup) {
      dogInfo.innerHTML = `
        <img src="${pup.image}" />
        <h2>${pup.name}</h2>
        <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
  
      const dogButton = dogInfo.querySelector('button');
      dogButton.addEventListener('click', () => toggleGoodDog(pup));
    }
  
    // تغيير حالة الكلب (Good/Bad)
    function toggleGoodDog(pup) {
      pup.isGoodDog = !pup.isGoodDog;
  
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isGoodDog: pup.isGoodDog }),
      })
        .then(response => response.json())
        .then(updatedPup => {
          showDogInfo(updatedPup);
          if (filterOn) {
            fetchFilteredDogs();
          }
        });
    }
  
    // تصفية الكلاب الجيدة
    filterButton.addEventListener('click', () => {
      filterOn = !filterOn;
      filterButton.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;
      fetchFilteredDogs();
    });
  
    // جلب الكلاب المفلترة
    function fetchFilteredDogs() {
      fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(pups => {
          if (filterOn) {
            const goodDogs = pups.filter(pup => pup.isGoodDog);
            renderDogBar(goodDogs);
          } else {
            renderDogBar(pups);
          }
        });
    }
  });
  