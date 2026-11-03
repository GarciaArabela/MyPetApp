export interface BreedOption {
  breed: string;
  subBreed: string;
  label: string;
}

export interface DogPet {
  id: string;
  imageUrl: string;
  label: string;
  breed: string;
  subBreed: string;
  fact: string;
  fetchedAt: number;
}

const API_BASE = 'https://dog.ceo/api';

export function toTitleCase(value: string): string {
  return value
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const FALLBACK_BREEDS: BreedOption[] = [
  { breed: 'retriever', subBreed: 'golden', label: 'Golden Retriever' },
  { breed: 'corgi', subBreed: 'pembroke', label: 'Pembroke Corgi' },
  { breed: 'corgi', subBreed: 'cardigan', label: 'Cardigan Corgi' },
  { breed: 'husky', subBreed: '', label: 'Husky' },
  { breed: 'bulldog', subBreed: 'french', label: 'French Bulldog' },
  { breed: 'bulldog', subBreed: 'english', label: 'English Bulldog' },
  { breed: 'bulldog', subBreed: 'boston', label: 'Boston Bulldog' },
  { breed: 'shiba', subBreed: '', label: 'Shiba Inu' },
  { breed: 'germanshepherd', subBreed: '', label: 'German Shepherd' },
  { breed: 'poodle', subBreed: 'toy', label: 'Toy Poodle' },
  { breed: 'poodle', subBreed: 'standard', label: 'Standard Poodle' },
  { breed: 'poodle', subBreed: 'miniature', label: 'Miniature Poodle' },
  { breed: 'labrador', subBreed: '', label: 'Labrador Retriever' },
  { breed: 'beagle', subBreed: '', label: 'Beagle' },
  { breed: 'dachshund', subBreed: '', label: 'Dachshund' },
  { breed: 'pomeranian', subBreed: '', label: 'Pomeranian' },
  { breed: 'samoyed', subBreed: '', label: 'Samoyed' },
  { breed: 'mountain', subBreed: 'bernese', label: 'Bernese Mountain Dog' },
  { breed: 'mountain', subBreed: 'swiss', label: 'Swiss Mountain Dog' },
  { breed: 'australian', subBreed: 'shepherd', label: 'Australian Shepherd' },
  { breed: 'australian', subBreed: 'kelpie', label: 'Australian Kelpie' },
  { breed: 'pug', subBreed: '', label: 'Pug' },
  { breed: 'boxer', subBreed: '', label: 'Boxer' },
  { breed: 'chihuahua', subBreed: '', label: 'Chihuahua' },
  { breed: 'doberman', subBreed: '', label: 'Doberman' },
  { breed: 'rottweiler', subBreed: '', label: 'Rottweiler' },
  { breed: 'dalmatian', subBreed: '', label: 'Dalmatian' },
  { breed: 'collie', subBreed: 'border', label: 'Border Collie' },
  { breed: 'dane', subBreed: 'great', label: 'Great Dane' },
  { breed: 'shihtzu', subBreed: '', label: 'Shih Tzu' },
  { breed: 'terrier', subBreed: 'yorkshire', label: 'Yorkshire Terrier' },
  { breed: 'terrier', subBreed: 'jack', label: 'Jack Russell Terrier' },
  { breed: 'terrier', subBreed: 'scottish', label: 'Scottish Terrier' },
  { breed: 'terrier', subBreed: 'cairn', label: 'Cairn Terrier' },
  { breed: 'terrier', subBreed: 'westhighland', label: 'West Highland Terrier' },
  { breed: 'terrier', subBreed: 'bull', label: 'Bull Terrier' },
  { breed: 'akita', subBreed: '', label: 'Akita' },
  { breed: 'malamute', subBreed: '', label: 'Alaskan Malamute' },
  { breed: 'maltese', subBreed: '', label: 'Maltese' },
  { breed: 'bichon', subBreed: 'frise', label: 'Bichon Frise' },
  { breed: 'hound', subBreed: 'basset', label: 'Basset Hound' },
  { breed: 'hound', subBreed: 'blood', label: 'Bloodhound' },
  { breed: 'hound', subBreed: 'afghan', label: 'Afghan Hound' },
  { breed: 'hound', subBreed: 'ibizan', label: 'Ibizan Hound' },
  { breed: 'spaniel', subBreed: 'cocker', label: 'Cocker Spaniel' },
  { breed: 'spaniel', subBreed: 'brittany', label: 'Brittany Spaniel' },
  { breed: 'spaniel', subBreed: 'english', label: 'English Springer Spaniel' },
  { breed: 'mastiff', subBreed: 'bull', label: 'Bull Mastiff' },
  { breed: 'mastiff', subBreed: 'tibetan', label: 'Tibetan Mastiff' },
  { breed: 'mastiff', subBreed: 'english', label: 'English Mastiff' },
  { breed: 'newfoundland', subBreed: '', label: 'Newfoundland' },
  { breed: 'stbernard', subBreed: '', label: 'Saint Bernard' },
  { breed: 'vizsla', subBreed: '', label: 'Vizsla' },
  { breed: 'weimaraner', subBreed: '', label: 'Weimaraner' },
  { breed: 'whippet', subBreed: '', label: 'Whippet' },
  { breed: 'greyhound', subBreed: 'italian', label: 'Italian Greyhound' },
  { breed: 'havanese', subBreed: '', label: 'Havanese' },
  { breed: 'papillon', subBreed: '', label: 'Papillon' },
  { breed: 'chow', subBreed: '', label: 'Chow Chow' },
  { breed: 'sharpei', subBreed: '', label: 'Shar Pei' },
  { breed: 'basenji', subBreed: '', label: 'Basenji' },
  { breed: 'schnauzer', subBreed: 'giant', label: 'Giant Schnauzer' },
  { breed: 'schnauzer', subBreed: 'miniature', label: 'Miniature Schnauzer' },
  { breed: 'sheepdog', subBreed: 'shetland', label: 'Shetland Sheepdog' },
  { breed: 'sheepdog', subBreed: 'english', label: 'Old English Sheepdog' },
  { breed: 'cockapoo', subBreed: '', label: 'Cockapoo' },
  { breed: 'labradoodle', subBreed: '', label: 'Labradoodle' },
  { breed: 'cavapoo', subBreed: '', label: 'Cavapoo' },
  { breed: 'keeshond', subBreed: '', label: 'Keeshond' },
  { breed: 'lhasa', subBreed: '', label: 'Lhasa Apso' },
  { breed: 'pekinese', subBreed: '', label: 'Pekingese' },
  { breed: 'pitbull', subBreed: '', label: 'Pitbull' },
  { breed: 'setter', subBreed: 'irish', label: 'Irish Setter' },
  { breed: 'setter', subBreed: 'english', label: 'English Setter' },
  { breed: 'pointer', subBreed: 'german', label: 'German Pointer' },
  { breed: 'pyrenees', subBreed: '', label: 'Great Pyrenees' },
  { breed: 'ridgeback', subBreed: 'rhodesian', label: 'Rhodesian Ridgeback' },
  { breed: 'waterdog', subBreed: 'spanish', label: 'Spanish Water Dog' },
  { breed: 'wolfhound', subBreed: 'irish', label: 'Irish Wolfhound' },
];

export const POPULAR_BREEDS: { label: string; breed: string; subBreed: string; emoji: string }[] = [
  { label: 'Golden Retriever', breed: 'retriever', subBreed: 'golden', emoji: '🐕' },
  { label: 'Corgi', breed: 'corgi', subBreed: 'pembroke', emoji: '🦊' },
  { label: 'Husky', breed: 'husky', subBreed: '', emoji: '🐺' },
  { label: 'French Bulldog', breed: 'bulldog', subBreed: 'french', emoji: '🐶' },
  { label: 'Shiba Inu', breed: 'shiba', subBreed: '', emoji: '🐾' },
  { label: 'Dachshund', breed: 'dachshund', subBreed: '', emoji: '🐕' },
  { label: 'Poodle', breed: 'poodle', subBreed: 'toy', emoji: '🐩' },
  { label: 'German Shepherd', breed: 'germanshepherd', subBreed: '', emoji: '🐶' },
  { label: 'Samoyed', breed: 'samoyed', subBreed: '', emoji: '☁️' },
  { label: 'Bernese Mountain Dog', breed: 'mountain', subBreed: 'bernese', emoji: '🏔️' },
  { label: 'Beagle', breed: 'beagle', subBreed: '', emoji: '🐕' },
  { label: 'Pomeranian', breed: 'pomeranian', subBreed: '', emoji: '🦁' },
  { label: 'Pug', breed: 'pug', subBreed: '', emoji: '🐾' },
  { label: 'Border Collie', breed: 'collie', subBreed: 'border', emoji: '🐕' },
  { label: 'Australian Shepherd', breed: 'australian', subBreed: 'shepherd', emoji: '🐶' },
  { label: 'Shih Tzu', breed: 'shihtzu', subBreed: '', emoji: '🐾' },
  { label: 'Doberman', breed: 'doberman', subBreed: '', emoji: '🐕' },
  { label: 'Great Dane', breed: 'dane', subBreed: 'great', emoji: '👑' },
  { label: 'Basset Hound', breed: 'hound', subBreed: 'basset', emoji: '🐶' },
  { label: 'Yorkshire Terrier', breed: 'terrier', subBreed: 'yorkshire', emoji: '🎀' },
];

let cachedBreeds: BreedOption[] | null = null;

export async function getBreedOptions(): Promise<BreedOption[]> {
  if (cachedBreeds) {
    return cachedBreeds;
  }

  try {
    const response = await fetch(`${API_BASE}/breeds/list/all`);
    if (!response.ok) {
      throw new Error('Unable to connect to the dog breed directory.');
    }

    const result = (await response.json()) as {
      status: string;
      message: Record<string, string[]>;
    };

    if (result.status !== 'success' || !result.message) {
      throw new Error('Received unexpected data from dog breed service.');
    }

    const list: BreedOption[] = [];

    for (const [breed, subBreeds] of Object.entries(result.message)) {
      if (subBreeds.length === 0) {
        list.push({
          breed,
          subBreed: '',
          label: toTitleCase(breed),
        });
      } else {
        for (const sub of subBreeds) {
          list.push({
            breed,
            subBreed: sub,
            label: `${toTitleCase(sub)} ${toTitleCase(breed)}`,
          });
        }
      }
    }

    list.sort((a, b) => a.label.localeCompare(b.label));
    cachedBreeds = list;
    return list;
  } catch (err) {
    console.warn('Using offline fallback breeds catalog:', err);
    cachedBreeds = [...FALLBACK_BREEDS].sort((a, b) => a.label.localeCompare(b.label));
    return cachedBreeds;
  }
}

const BREED_FACTS: Record<string, string> = {
  retriever: 'Renowned for their gentle temperament, intelligence, and legendary love for playing fetch in water.',
  husky: 'Vocal and adventurous pack dogs with iconic wolf-like coats and endless winter stamina.',
  corgi: 'Beloved royal herders famous for their sunny smiles, alert ears, and joyful waddling walks.',
  labrador: 'Ever-cheerful and deeply loyal, consistently celebrated as one of the world’s most loving family dogs.',
  pug: 'Ancient companion breed cherished for whimsical expressions, compact charm, and humorous personalities.',
  germanshepherd: 'Courageous, vigilant, and exceptionally quick learners with unmatched devotion to their pack.',
  bulldog: 'Calm, gentle companions with sweet demeanor, distinctive wrinkles, and hearts of pure gold.',
  poodle: 'Brilliantly smart and athletic champions with hypoallergenic, low-shedding curly coats.',
  beagle: 'Merry and curious scent hounds guided by an extraordinary nose and affectionate spirit.',
  chihuahua: 'Compact pups with huge personalities, sharp instincts, and fierce loyalty to their favorite human.',
  shiba: 'Spirited, fastidious, and spirited Japanese companions with cat-like grace and an independent spark.',
  boxer: 'High-spirited, playful athletes who remain enthusiastic puppies at heart throughout their lives.',
  dachshund: 'Clever, brave little badger hunters packed with spunk, curiosity, and endless determination.',
  samoyed: 'Gentle arctic dogs with smiling faces, fluffy white coats, and naturally warm, friendly dispositions.',
  rottweiler: 'Confident, deeply loyal guardians who are affectionate and tender-hearted with their family.',
  dalmatian: 'Energetic, spotted heritage coach dogs known for their stamina and dignified, playful elegance.',
  mastiff: 'Gentle giants known throughout history for quiet dignity, courage, and protective warmth.',
  collie: 'Graceful, intelligent herders famous for keen perception and devoted companionship.',
  maltese: 'Glamorous and lively toy companions that have brought joy and affection to households for thousands of years.',
  akita: 'Noble, profoundly loyal Japanese protectors famous for courage and deep devotion to family.',
  malamute: 'Powerful arctic freighting dogs with majestic heavy coats and a friendly, affectionate nature.',
  bernese: 'Affectionate mountain gentle giants with striking tricolor coats and calm, loving hearts.',
  shepherd: 'Versatile, intelligent workaholics who thrive on mental challenges, agility, and companionship.',
  dane: 'Known as the "Apollo of dogs," combining tremendous stature with a gentle, patient heart.',
  shihtzu: 'Bred specifically to be royal lap warmers with luxuriant hair and delightful companionship.',
  terrier: 'Feisty, energetic, and full of character, with fearless determination and joyful pep.',
  pomeranian: 'Tiny, extroverted puffballs with alert foxy faces and abundant spirited charm.',
  basset: 'Mild-mannered hounds with soulful eyes, velvety long ears, and the second most sensitive nose in dogdom.',
  bloodhound: 'Relentless trackers whose scent-trailing abilities are so reliable they are accepted in court.',
  spaniel: 'Enthusiastic bird hunters with silky ears, tender expressions, and boundless affectionate joy.',
  newfoundland: 'Legendary water rescue dogs with webbed paws, waterproof coats, and sweet "nanny dog" patience.',
  stbernard: 'Famous alpine rescue dogs renowned for their enormous size, gentle patience, and kind expressions.',
  vizsla: 'Known as the "velcro dog" for sticking close to their humans with athletic grace and warm affection.',
  weimaraner: 'The "silver ghost" of dogs, sleek, fast, and intensely devoted to human companionship.',
  whippet: 'Gentle, quiet sprinters capable of reaching 35 mph, who love nothing more than curling up on cozy blankets.',
  greyhound: 'Ancient, aerodynamic speed champions who are remarkably calm, sweet, and gentle indoor companions.',
  havanese: 'Cuba’s cheerful national dog with silky springy hair and an infectious sense of fun.',
  papillon: 'Named for their delicate butterfly-wing ears, these are among the smartest and quickest toy dogs.',
  chow: 'Ancient noble Chinese dogs distinguished by a lion-like ruff and unique blue-black tongue.',
  sharpei: 'Iconic for deep wrinkles and a bristly coat, historically loyal guardians of ancient farms.',
  basenji: 'The "barkless dog" of Africa who grooms like a cat and produces a musical yodel or chortle.',
  schnauzer: 'Distinguished by aristocratic beards and bushy eyebrows with an alert, lively demeanor.',
  cockapoo: 'One of the original loving designer companions, combining the sweetness of the cocker spaniel with poodle wit.',
  labradoodle: 'Outgoing, friendly, and allergy-friendly stars known for their wavy coats and enthusiastic smiles.',
  dhole: 'Wild whistling dogs of Central Asia celebrated for intricate pack communication.',
  pyrenees: 'Imposing, calm flock guardians with majestic white coats and a patient, protective aura.',
  ridgeback: 'African lion dogs distinguished by the unique hair ridge running counter-direction along their spine.',
};

const GENERAL_FACTS: string[] = [
  'Dogs have an extraordinary sense of smell up to 100,000 times more sensitive than humans.',
  'A dog’s nose print is as unique and distinctive as a human fingerprint.',
  'Dogs can learn over 100 words, gestures, and signals, showing remarkable communication skills.',
  'Gently petting a friendly dog can lower blood pressure and boost heart health in both dog and human.',
  'Dogs dream just like us — twitching paws and soft woofs mean they are likely chasing balls in dreamland!',
  'A dog’s sense of hearing is more than four times further than human hearing range.',
  'Dogs wag their tails to express a wide palette of emotions, from happy excitement to curious greeting.',
  'Dogs release oxytocin (the bonding hormone) when looking lovingly into their guardian’s eyes.',
];

export function getBreedFact(breed: string, label: string): string {
  const normalized = breed.toLowerCase().replace(/[^a-z]/g, '');
  for (const [key, fact] of Object.entries(BREED_FACTS)) {
    if (normalized.includes(key)) {
      return fact;
    }
  }

  // Use a pseudo-random hash of the label to pick a consistent general fact for this breed
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash << 5) - hash + label.charCodeAt(i);
  }
  const index = Math.abs(hash) % GENERAL_FACTS.length;
  return GENERAL_FACTS[index];
}

export async function fetchDog(selectedOption?: BreedOption): Promise<DogPet> {
  let target = selectedOption;

  if (!target) {
    const options = await getBreedOptions();
    if (options.length === 0) {
      throw new Error('No breeds available at this time.');
    }
    target = options[Math.floor(Math.random() * options.length)];
  }

  const endpoint = target.subBreed
    ? `${API_BASE}/breed/${encodeURIComponent(target.breed)}/${encodeURIComponent(target.subBreed)}/images/random`
    : `${API_BASE}/breed/${encodeURIComponent(target.breed)}/images/random`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Could not fetch a photo for ${target.label}.`);
  }

  const data = (await response.json()) as { status: string; message: string };
  if (data.status !== 'success' || typeof data.message !== 'string') {
    throw new Error('Received invalid image data from dog service.');
  }

  const fact = getBreedFact(target.breed, target.label);

  return {
    id: `${target.breed}-${target.subBreed}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    imageUrl: data.message,
    label: target.label,
    breed: target.breed,
    subBreed: target.subBreed,
    fact,
    fetchedAt: Date.now(),
  };
}

// Web Audio sound synthesizer (no external audio files required)
class SoundPlayer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check saved mute preference
    try {
      this.muted = localStorage.getItem('mypetapp_muted') === 'true';
    } catch {
      this.muted = false;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem('mypetapp_muted', String(muted));
    } catch {
      // ignore
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playChime() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Play a pleasant warm 2-tone melodic chime
      [
        { freq: 523.25, start: 0, dur: 0.15 }, // C5
        { freq: 659.25, start: 0.1, dur: 0.25 }, // E5
        { freq: 783.99, start: 0.2, dur: 0.4 }, // G5
      ].forEach(({ freq, start, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.08, now + start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      });
    } catch {
      // Ignore audio failure if unsupported
    }
  }

  public playHeart() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }
}

export const soundPlayer = new SoundPlayer();

