document.addEventListener('DOMContentLoaded', function() {
    fetch('/admin/items')
        .then(response => response.json())
        .then(items => {
            const container = document.getElementById('itemsContainer');
            const row = document.createElement('div');
            row.className = 'row';

            items.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-sm-12 col-md-6 col-lg-4 mb-4';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const carouselId = `carousel${item._id}`;
                const carousel = `
                    <div id="${carouselId}" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            ${item.images.map((img, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100" alt="...">
                                </div>
                            `).join('')}
                        </div>
                        <a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                `;

                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        ${carousel}
                    </div>
                `;

                col.appendChild(card);
                row.appendChild(col);
            });

            container.appendChild(row);

            items.forEach(item => {
                $(`#carousel${item._id}`).carousel();
            });
        })
        .catch(error => console.error('Error loading items:', error));
});
