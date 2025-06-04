// Initialisation des compteurs à zéro et mise à jour au chargement
document.addEventListener('DOMContentLoaded', () => {
  resetForm();
  updateSummary(); // Mise à jour initiale du récapitulatif
});

function resetForm() {
  document.getElementById('adults').value = 0;
  document.getElementById('children').value = 0;
  document.getElementById('rooms').value = 0;
  document.getElementById('childrenAges').innerHTML = ''; // Supprime les champs d'âge
  document.getElementById('workTrip').checked = false;
  document.getElementById('formError').textContent = ''; // Vide les messages d'erreur
  // Réinitialiser les champs text et date manuellement car form.reset() ne le fait pas toujours bien avec Bootstrap ou type="date"
  document.getElementById('lieu').value = '';
  document.getElementById('dateArrivee').value = '';
  document.getElementById('dateDepart').value = '';

  updateSummary(); // Mise à jour du récapitulatif après reset
}

// Gestion des boutons +/-
document.querySelectorAll('.plus, .minus').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.dataset.target;
    const targetInput = document.getElementById(targetId);
    let value = parseInt(targetInput.value, 10);

    if (this.classList.contains('plus')) {
      value++;
    } else {
      value--;
    }

    // S'assurer que la valeur ne descend pas en dessous de 0
    if (value < 0) {
      value = 0;
    }

    targetInput.value = value;

    // Si le nombre d'enfants change, mettre à jour les champs d'âge
    if (targetId === 'children') {
      updateChildrenAges();
    }

    // Mettre à jour le récapitulatif
    updateSummary();
  });
});

// Affichage dynamique des champs d'âge des enfants
function updateChildrenAges() {
  const nb = parseInt(document.getElementById('children').value, 10);
  const container = document.getElementById('childrenAges');
  container.innerHTML = ''; // Vide le container actuel

  if (nb > 0) {
      for (let i = 1; i <= nb; i++) {
        const ageInputGroup = document.createElement('div');
        ageInputGroup.className = 'mb-2'; // Marge en bas pour chaque champ d'âge

        const label = document.createElement('label');
        label.setAttribute('for', `childAge${i}`);
        label.textContent = `Âge de l'enfant ${i} (0-17 ans)`;
        label.className = 'form-label'; // Classe Bootstrap pour label

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control child-age'; // Classe Bootstrap + classe pour sélection JS
        input.id = `childAge${i}`; // ID unique pour chaque champ
        input.min = 0;
        input.max = 17;
        input.value = ''; // Laisser vide initialement
        input.required = true;
        input.setAttribute('data-index', i); // Pour référence si besoin

        ageInputGroup.appendChild(label);
        ageInputGroup.appendChild(input);
        container.appendChild(ageInputGroup);
      }
  }

  // Ajouter un écouteur d'événement pour mettre à jour le résumé quand un âge est saisi
  container.querySelectorAll('.child-age').forEach(input => {
      input.addEventListener('input', updateSummary);
  });
}

// Mise à jour du récapitulatif
function updateSummary() {
  document.getElementById('summaryLieu').textContent = document.getElementById('lieu')?.value || '-';
  document.getElementById('summaryAdults').textContent = document.getElementById('adults').value;
  document.getElementById('summaryChildren').textContent = document.getElementById('children').value;
  document.getElementById('summaryRooms').textContent = document.getElementById('rooms').value;
  document.getElementById('summaryWork').textContent = document.getElementById('workTrip').checked ? 'Oui' : 'Non';

  const dateA = document.getElementById('dateArrivee').value;
  const dateD = document.getElementById('dateDepart').value;
  // Formater les dates pour l'affichage si elles existent
  const formattedDateA = dateA ? new Date(dateA).toLocaleDateString('fr-FR') : '-';
  const formattedDateD = dateD ? new Date(dateD).toLocaleDateString('fr-FR') : '-';
  document.getElementById('summaryDates').textContent = (dateA && dateD) ? `${formattedDateA} → ${formattedDateD}` : '-';

  // Récupérer et afficher les âges des enfants
  const ages = Array.from(document.querySelectorAll('.child-age'))
                    .map(input => input.value)
                    .filter(v => v !== '' && !isNaN(v)); // Filtrer les champs vides ou non numériques

  document.getElementById('summaryAges').textContent = ages.length ? ages.join(', ') : '-';
}

// Écouteurs pour mettre à jour le récapitulatif en temps réel sur les champs principaux
document.querySelectorAll('#lieu, #adults, #children, #rooms, #workTrip, #dateArrivee, #dateDepart').forEach(el => {
  el.addEventListener('input', updateSummary);
});


// Gestion du bouton "Effacer" (utilise le resetForm personnalisé)
document.getElementById('reservationForm').addEventListener('reset', (e) => {
  e.preventDefault(); // Empêcher le reset par défaut du navigateur
  resetForm(); // Appeler notre fonction de reset
});


// Validation du formulaire à la soumission
document.getElementById('reservationForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Empêcher la soumission par défaut

  const dateA = document.getElementById('dateArrivee').value;
  const dateD = document.getElementById('dateDepart').value;
  const errorDiv = document.getElementById('formError');
  errorDiv.textContent = ''; // Réinitialiser les messages d'erreur

  // 1. Vérification des dates
  if (dateA && dateD && new Date(dateA) >= new Date(dateD)) {
    errorDiv.textContent = "La date d'arrivée doit être antérieure à la date de départ.";
    // Ajouter une classe d'erreur Bootstrap si tu veux styliser l'input
    document.getElementById('dateArrivee').classList.add('is-invalid');
    document.getElementById('dateDepart').classList.add('is-invalid');
    return; // Arrêter la validation
  } else {
     // Retirer les classes d'erreur si la validation est bonne
    document.getElementById('dateArrivee').classList.remove('is-invalid');
    document.getElementById('dateDepart').classList.remove('is-invalid');
  }


  // 2. Vérification des âges des enfants (si des enfants sont présents)
  const nbEnfants = parseInt(document.getElementById('children').value, 10);
  if (nbEnfants > 0) {
    const ages = document.querySelectorAll('.child-age');
    for (let input of ages) {
      const age = parseInt(input.value, 10);
      if (input.value === '' || isNaN(age) || age < 0 || age > 17) {
        errorDiv.textContent = "L'âge de chaque enfant doit être un nombre compris entre 0 et 17 ans.";
        input.classList.add('is-invalid'); // Ajouter classe d'erreur Bootstrap
        return; // Arrêter la validation
      } else {
         input.classList.remove('is-invalid'); // Retirer la classe d'erreur
      }
    }
  } else {
       // Si pas d'enfants, s'assurer qu'il n'y a pas de classes is-invalid résiduelles
       document.querySelectorAll('.child-age').forEach(input => input.classList.remove('is-invalid'));
  }


  // Si tout est valide :
  alert('Réservation validée !');
  // Ici, tu peux envoyer les données du formulaire via AJAX ou faire une redirection, etc.
});
