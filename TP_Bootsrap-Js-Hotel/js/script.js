// Initialisation des compteurs à zéro et mise à jour au chargement
document.addEventListener('DOMContentLoaded', () => {
  reinitialiserFormulaire();
});

function reinitialiserFormulaire() {
  document.getElementById('adultes').value = 0;
  document.getElementById('enfants').value = 0;
  document.getElementById('chambres').value = 0;
  document.getElementById('agesEnfants').innerHTML = ''; // Supprime les champs d'âge
  document.getElementById('voyageTravail').checked = false;
  document.getElementById('erreurFormulaire').textContent = ''; // Vide les messages d'erreur
  // Réinitialiser les champs text et date manuellement
  document.getElementById('lieu').value = '';
  document.getElementById('dateArrivee').value = '';
  document.getElementById('dateDepart').value = '';

  // Cacher la carte de récapitulatif lors de la réinitialisation, car plus de valeur à afficher
  document.getElementById('carteRecap').classList.add('d-none');
}

// Gestion des boutons +/-
document.querySelectorAll('.ajouter, .soustraire').forEach(bouton => {
  bouton.addEventListener('click', function(event) {
    const boutonClique = event.target;
    const idCible = boutonClique.dataset.target;
    const champCible = document.getElementById(idCible);
    let valeur = parseInt(champCible.value, 10);

    if (boutonClique.classList.contains('ajouter')) {
      valeur++;
    } else {
      valeur--;
    }

    if (valeur < 0) {
      valeur = 0;
    }

    champCible.value = valeur;

    if (idCible === 'enfants') {
      mettreAJourAgesEnfants();
    }
  });
});

// Affichage des champs d'âge des enfants
function mettreAJourAgesEnfants() {
  const nombreEnfants = parseInt(document.getElementById('enfants').value, 10);
  const conteneur = document.getElementById('agesEnfants');
  conteneur.innerHTML = ''; // Vide le container actuel

  if (nombreEnfants > 0) {
      for (let i = 1; i <= nombreEnfants; i++) {
        const groupeAge = document.createElement('div');
        groupeAge.className = 'mb-2';

        const etiquette = document.createElement('label');
        etiquette.setAttribute('for', `ageEnfant${i}`);
        etiquette.textContent = `Âge de l'enfant ${i} (0-17 ans)`;
        etiquette.className = 'form-label';

        const champ = document.createElement('input');
        champ.type = 'number';
        champ.className = 'form-control age-enfant';
        champ.id = `ageEnfant${i}`;
        champ.min = 0;
        champ.max = 17;
        champ.value = '';
        champ.required = true;

        groupeAge.appendChild(etiquette);
        groupeAge.appendChild(champ);
        conteneur.appendChild(groupeAge);
      }
  }
}

// Mise à jour du récapitulatif avec les valeurs saisies
function mettreAJourRecapitulatif() {
  document.getElementById('recapLieu').textContent = document.getElementById('lieu')?.value || '-';
  document.getElementById('recapAdultes').textContent = document.getElementById('adultes').value;
  document.getElementById('recapEnfants').textContent = document.getElementById('enfants').value;
  document.getElementById('recapChambres').textContent = document.getElementById('chambres').value;
  document.getElementById('recapTravail').textContent = document.getElementById('voyageTravail').checked ? 'Oui' : 'Non';

  const dateArrivee = document.getElementById('dateArrivee').value;
  const dateDepart = document.getElementById('dateDepart').value;
  document.getElementById('recapDates').textContent = (dateArrivee && dateDepart) ? `${dateArrivee} → ${dateDepart}` : '-';

  const ages = Array.from(document.querySelectorAll('.age-enfant'))
                    .map(champ => champ.value)
                    .filter(v => v !== '');
  document.getElementById('recapAges').textContent = ages.length ? ages.join(', ') : '-';
}

// Gestion du bouton "Effacer" qui permet d'enlever toutes les valeurs saisies
document.getElementById('formulaireReservation').addEventListener('reset', (e) => {
  e.preventDefault();
  reinitialiserFormulaire();
});

// Validation du formulaire avec le bouton "Rechercher"
document.getElementById('formulaireReservation').addEventListener('submit', function(e) {
  e.preventDefault();

  const dateArrivee = document.getElementById('dateArrivee').value;
  const dateDepart = document.getElementById('dateDepart').value;
  const divErreur = document.getElementById('erreurFormulaire');
  divErreur.textContent = '';

  // Vérification des dates et utilisation de new pour crééer un objet date pour ensuite comparer les dates
  if (dateArrivee && dateDepart && new Date(dateArrivee) >= new Date(dateDepart)) {
    divErreur.textContent = "La date d'arrivée doit être antérieure à la date de départ.";
    return;
  }

  // Vérification des âges des enfants
  const nombreEnfants = parseInt(document.getElementById('enfants').value, 10);
  if (nombreEnfants > 0) {
    const champsAge = document.querySelectorAll('.age-enfant');
    for (let champ of champsAge) {
      const age = parseInt(champ.value, 10);
      // Vérifie que l'âge est bien un nombre et que c'est entre 0 et 17 ans
      if (champ.value === '' || isNaN(age) || age < 0 || age > 17) {
        divErreur.textContent = "L'âge de chaque enfant doit être un nombre compris entre 0 et 17 ans.";
        return;
      }
    }
  }

  // Si tout est rempli et correct, affichage du récap
  mettreAJourRecapitulatif();
  document.getElementById('carteRecap').classList.remove('d-none');
  alert('Réservation validée !');
});
