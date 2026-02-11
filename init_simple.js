// Script de inicialización para MongoDB con 100 productos reales
// Para ejecutar: docker exec mongo-inventario mongosh inventario --eval "$(cat init_productos.js)"

db = db.getSiblingDB('inventario');

// Limpiar colección existente
db.productos.drop();

// Lista de 100 productos reales organizados por categorías
const productos = [
  // Tecnología (10 productos)
  {
    nombre: "iPhone 15 Pro Max 256GB",
    descripcion: "Smartphone Apple con chip A17 Pro y cámara de 48MP", 
    precio: 1199.99,
    categoria: "Tecnología",
    stock: 25,
    marca: "Apple",
    sku: "TEC-0001",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Samsung Galaxy S24 Ultra",
    descripcion: "Smartphone Android premium con S Pen incluido",
    precio: 1299.99,
    categoria: "Tecnología",
    stock: 30,
    marca: "Samsung", 
    sku: "TEC-0002",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "MacBook Pro 14 M3 Chip",
    descripcion: "Laptop profesional con chip M3 16GB RAM 512GB SSD",
    precio: 1999.99,
    categoria: "Tecnología",
    stock: 15,
    marca: "Apple",
    sku: "TEC-0003", 
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Dell XPS 13 Plus",
    descripcion: "Ultrabook premium con Intel Core i7 16GB RAM",
    precio: 1499.99,
    categoria: "Tecnología", 
    stock: 20,
    marca: "Dell",
    sku: "TEC-0004",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "iPad Pro 12.9 256GB",
    descripcion: "Tablet profesional con chip M2 y Liquid Retina XDR",
    precio: 1099.99,
    categoria: "Tecnología",
    stock: 18,
    marca: "Apple",
    sku: "TEC-0005",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Sony WH-1000XM5", 
    descripcion: "Auriculares inalámbricos con cancelación de ruido",
    precio: 399.99,
    categoria: "Tecnología",
    stock: 40,
    marca: "Sony",
    sku: "TEC-0006",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Nintendo Switch OLED",
    descripcion: "Consola híbrida con pantalla OLED de 7 pulgadas",
    precio: 349.99,
    categoria: "Tecnología",
    stock: 35,
    marca: "Nintendo",
    sku: "TEC-0007",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Apple Watch Series 9 GPS",
    descripcion: "Smartwatch con GPS y monitor de salud avanzado",
    precio: 399.99,
    categoria: "Tecnología",
    stock: 28,
    marca: "Apple",
    sku: "TEC-0008",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Canon EOS R5 Mirrorless",
    descripcion: "Cámara profesional 45MP con video 8K",
    precio: 3899.99,
    categoria: "Tecnología",
    stock: 8,
    marca: "Canon",
    sku: "TEC-0009",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Logitech MX Master 3S",
    descripcion: "Mouse inalámbrico premium para productividad",
    precio: 99.99,
    categoria: "Tecnología",
    stock: 50,
    marca: "Logitech",
    sku: "TEC-0010",
    activo: true,
    fechaCreacion: new Date()
  },
  // Hogar (15 productos)
  {
    nombre: "Dyson V15 Detect",
    descripcion: "Aspiradora inalámbrica con tecnología láser",
    precio: 749.99,
    categoria: "Hogar",
    stock: 12,
    marca: "Dyson",
    sku: "HOG-0001",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Nespresso Vertuo Next",
    descripcion: "Cafetera de cápsulas automática con espumador",
    precio: 179.99,
    categoria: "Hogar",
    stock: 25,
    marca: "Nespresso",
    sku: "HOG-0002",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "KitchenAid Artisan",
    descripcion: "Batidora de pedestal 4.8L con bowl de acero",
    precio: 379.99,
    categoria: "Hogar", 
    stock: 20,
    marca: "KitchenAid",
    sku: "HOG-0003",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Philips Hue Starter Kit",
    descripcion: "Kit de iluminación inteligente RGB con bridge",
    precio: 199.99,
    categoria: "Hogar",
    stock: 22,
    marca: "Philips",
    sku: "HOG-0004",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Roomba i7+",
    descripcion: "Robot aspirador con vaciado automático",
    precio: 599.99,
    categoria: "Hogar",
    stock: 15,
    marca: "iRobot",
    sku: "HOG-0005",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Instant Pot Duo 6Qt",
    descripcion: "Olla eléctrica multifuncional 7 en 1",
    precio: 99.99,
    categoria: "Hogar",
    stock: 30,
    marca: "Instant Pot",
    sku: "HOG-0006",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Ninja Foodi 8Qt",
    descripcion: "Freidora de aire y olla de presión 2 en 1",
    precio: 249.99,
    categoria: "Hogar",
    stock: 18,
    marca: "Ninja",
    sku: "HOG-0007",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Weber Genesis II E-315",
    descripcion: "Parrilla de gas con 3 quemadores y termómetro",
    precio: 899.99,
    categoria: "Hogar",
    stock: 8,
    marca: "Weber",
    sku: "HOG-0008",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Shark Navigator Lift-Away",
    descripcion: "Aspiradora vertical con tecnología anti-wrap",
    precio: 179.99,
    categoria: "Hogar",
    stock: 24,
    marca: "Shark",
    sku: "HOG-0009",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Honeywell HPA300",
    descripcion: "Purificador de aire HEPA para habitaciones grandes",
    precio: 249.99,
    categoria: "Hogar",
    stock: 16,
    marca: "Honeywell",
    sku: "HOG-0010",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "LG InstaView Refrigerator",
    descripcion: "Refrigerador 28 pies cúbicos con puerta transparente",
    precio: 2299.99,
    categoria: "Hogar",
    stock: 6,
    marca: "LG",
    sku: "HOG-0011",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Breville Barista Express",
    descripcion: "Máquina de espresso con molinillo integrado",
    precio: 699.99,
    categoria: "Hogar",
    stock: 14,
    marca: "Breville",
    sku: "HOG-0012",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Toshiba 32L Microwave",
    descripcion: "Microondas con convección y grill 32 litros",
    precio: 189.99,
    categoria: "Hogar",
    stock: 20,
    marca: "Toshiba",
    sku: "HOG-0013",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Purple Mattress Queen",
    descripcion: "Colchón de gel hipoalergénico tamaño queen",
    precio: 1199.99,
    categoria: "Hogar",
    stock: 10,
    marca: "Purple",
    sku: "HOG-0014",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Tempur-Pedic Cloud Pillow",
    descripcion: "Almohada de espuma viscoelástica suave",
    precio: 129.99,
    categoria: "Hogar",
    stock: 35,
    marca: "Tempur-Pedic",
    sku: "HOG-0015",
    activo: true,
    fechaCreacion: new Date()
  },
  // Ropa (15 productos)
  {
    nombre: "Nike Air Jordan 1 Retro",
    descripcion: "Zapatillas clásicas de baloncesto en cuero premium",
    precio: 170.00,
    categoria: "Ropa",
    stock: 40,
    marca: "Nike",
    sku: "ROP-0001",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Levi's 501 Original Jeans",
    descripcion: "Pantalones de mezclilla clásicos corte recto",
    precio: 89.99,
    categoria: "Ropa",
    stock: 60,
    marca: "Levi's",
    sku: "ROP-0002",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Patagonia Houdini Jacket",
    descripcion: "Chaqueta ultraligera resistente al viento",
    precio: 129.99,
    categoria: "Ropa",
    stock: 25,
    marca: "Patagonia",
    sku: "ROP-0003",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Ray-Ban Aviator Classic",
    descripcion: "Gafas de sol icónicas con lentes de cristal",
    precio: 154.99,
    categoria: "Ropa",
    stock: 45,
    marca: "Ray-Ban",
    sku: "ROP-0004",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Adidas Ultraboost 22",
    descripcion: "Tenis para correr con tecnología Boost",
    precio: 190.00,
    categoria: "Ropa",
    stock: 35,
    marca: "Adidas",
    sku: "ROP-0005",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The North Face Denali",
    descripcion: "Chaqueta de fleece clásica para actividades outdoor",
    precio: 179.99,
    categoria: "Ropa",
    stock: 28,
    marca: "The North Face",
    sku: "ROP-0006",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Champion Reverse Weave Hoodie",
    descripcion: "Sudadera con capucha en algodón premium",
    precio: 65.00,
    categoria: "Ropa",
    stock: 50,
    marca: "Champion",
    sku: "ROP-0007",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Timberland 6-Inch Premium",
    descripcion: "Botas waterproof en cuero nubuck amarillo",
    precio: 199.99,
    categoria: "Ropa",
    stock: 32,
    marca: "Timberland",
    sku: "ROP-0008",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Calvin Klein Boxer Briefs",
    descripcion: "Ropa interior de algodón elástico pack 3",
    precio: 42.50,
    categoria: "Ropa",
    stock: 75,
    marca: "Calvin Klein",
    sku: "ROP-0009",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Polo Ralph Lauren Classic Fit",
    descripcion: "Camisa polo de algodón piqué",
    precio: 89.50,
    categoria: "Ropa",
    stock: 55,
    marca: "Ralph Lauren",
    sku: "ROP-0010",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Vans Old Skool Classic",
    descripcion: "Zapatillas skate clásicas con franja lateral",
    precio: 65.00,
    categoria: "Ropa",
    stock: 48,
    marca: "Vans",
    sku: "ROP-0011",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Carhartt Work Jacket",
    descripcion: "Chaqueta de trabajo resistente al agua",
    precio: 129.99,
    categoria: "Ropa",
    stock: 22,
    marca: "Carhartt",
    sku: "ROP-0012",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Converse Chuck Taylor All Star",
    descripcion: "Zapatillas altas clásicas de lona",
    precio: 55.00,
    categoria: "Ropa",
    stock: 65,
    marca: "Converse",
    sku: "ROP-0013",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Under Armour HeatGear Shirt",
    descripcion: "Camiseta deportiva con tecnología moisture-wicking",
    precio: 29.99,
    categoria: "Ropa",
    stock: 70,
    marca: "Under Armour",
    sku: "ROP-0014",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Fossil Gen 6 Smartwatch",
    descripcion: "Reloj inteligente con Wear OS by Google",
    precio: 255.00,
    categoria: "Ropa",
    stock: 18,
    marca: "Fossil",
    sku: "ROP-0015",
    activo: true,
    fechaCreacion: new Date()
  },
  // Deportes (15 productos)
  {
    nombre: "Bowflex SelectTech 552",
    descripcion: "Mancuernas ajustables de 2.3 a 24 kg cada una",
    precio: 399.99,
    categoria: "Deportes",
    stock: 12,
    marca: "Bowflex",
    sku: "DEP-0001",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Peloton Bike+",
    descripcion: "Bicicleta estática con pantalla HD rotatoria",
    precio: 2495.00,
    categoria: "Deportes",
    stock: 5,
    marca: "Peloton",
    sku: "DEP-0002",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Wilson Pro Staff Tennis Racket",
    descripcion: "Raqueta de tenis profesional 97 sq in",
    precio: 249.99,
    categoria: "Deportes",
    stock: 20,
    marca: "Wilson",
    sku: "DEP-0003",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Spalding NBA Official Basketball",
    descripcion: "Balón oficial de la NBA en cuero compuesto",
    precio: 59.99,
    categoria: "Deportes",
    stock: 35,
    marca: "Spalding",
    sku: "DEP-0004",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Yeti Rambler 32oz",
    descripcion: "Botella térmica de acero inoxidable",
    precio: 44.99,
    categoria: "Deportes",
    stock: 50,
    marca: "Yeti",
    sku: "DEP-0005",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "TRX Suspension Trainer",
    descripcion: "Sistema de entrenamiento en suspensión portátil",
    precio: 195.00,
    categoria: "Deportes",
    stock: 25,
    marca: "TRX",
    sku: "DEP-0006",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Garmin Forerunner 945 LTE",
    descripcion: "Reloj GPS multideporte con conectividad LTE",
    precio: 649.99,
    categoria: "Deportes",
    stock: 15,
    marca: "Garmin",
    sku: "DEP-0007",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Coleman 4-Person Dome Tent",
    descripcion: "Tienda de campaña impermeable para 4 personas",
    precio: 89.99,
    categoria: "Deportes",
    stock: 18,
    marca: "Coleman",
    sku: "DEP-0008",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "RTIC 65Qt Cooler",
    descripcion: "Hielera ultra resistente con aislamiento superior",
    precio: 199.99,
    categoria: "Deportes",
    stock: 12,
    marca: "RTIC",
    sku: "DEP-0009",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Black Diamond Spot Headlamp",
    descripcion: "Linterna frontal LED 350 lúmenes resistente agua",
    precio: 39.95,
    categoria: "Deportes",
    stock: 45,
    marca: "Black Diamond",
    sku: "DEP-0010",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Hydro Flask 40oz Wide Mouth",
    descripcion: "Botella de acero inoxidable con aislamiento",
    precio: 49.95,
    categoria: "Deportes",
    stock: 42,
    marca: "Hydro Flask",
    sku: "DEP-0011",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Everlast Powercore Bag",
    descripcion: "Saco de boxeo de pie con base rellenable",
    precio: 199.99,
    categoria: "Deportes",
    stock: 8,
    marca: "Everlast",
    sku: "DEP-0012",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "NordicTrack T 6.5 Si Treadmill",
    descripcion: "Cinta de correr plegable con iFit incluido",
    precio: 799.99,
    categoria: "Deportes",
    stock: 6,
    marca: "NordicTrack",
    sku: "DEP-0013",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Schwinn IC4 Indoor Bike",
    descripcion: "Bicicleta estática con conectividad Bluetooth",
    precio: 899.99,
    categoria: "Deportes",
    stock: 9,
    marca: "Schwinn",
    sku: "DEP-0014",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Perfect Pushup Elite",
    descripcion: "Bases giratorias para flexiones con más efectividad",
    precio: 29.99,
    categoria: "Deportes",
    stock: 60,
    marca: "Perfect Pushup",
    sku: "DEP-0015",
    activo: true,
    fechaCreacion: new Date()
  },
  // Libros (15 productos)
  {
    nombre: "Dune - Frank Herbert",
    descripcion: "Novela épica de ciencia ficción, ganadora del premio Hugo",
    precio: 16.99,
    categoria: "Libros",
    stock: 80,
    marca: "Ace Books",
    sku: "LIB-0001",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Educated - Tara Westover",
    descripcion: "Memoria bestseller sobre educación y familia",
    precio: 17.99,
    categoria: "Libros",
    stock: 65,
    marca: "Random House",
    sku: "LIB-0002",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Seven Husbands of Evelyn Hugo",
    descripcion: "Novela romántica contemporánea de Taylor Jenkins Reid",
    precio: 16.99,
    categoria: "Libros",
    stock: 75,
    marca: "Atria Books",
    sku: "LIB-0003",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Atomic Habits - James Clear",
    descripcion: "Guía práctica para formar buenos hábitos",
    precio: 18.99,
    categoria: "Libros",
    stock: 90,
    marca: "Avery",
    sku: "LIB-0004",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Where the Crawdads Sing",
    descripcion: "Novela de misterio y coming-of-age de Delia Owens",
    precio: 15.99,
    categoria: "Libros",
    stock: 70,
    marca: "G.P. Putnam's Sons",
    sku: "LIB-0005",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Midnight Library - Matt Haig",
    descripcion: "Novela filosófica sobre las posibilidades de la vida",
    precio: 16.99,
    categoria: "Libros",
    stock: 55,
    marca: "Viking",
    sku: "LIB-0006",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Becoming - Michelle Obama",
    descripcion: "Autobiografía de la ex primera dama de Estados Unidos",
    precio: 19.99,
    categoria: "Libros",
    stock: 45,
    marca: "Crown",
    sku: "LIB-0007",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Handmaid's Tale - Margaret Atwood",
    descripcion: "Distopía clásica sobre una sociedad totalitaria",
    precio: 15.99,
    categoria: "Libros",
    stock: 60,
    marca: "Anchor Books",
    sku: "LIB-0008",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Sapiens - Yuval Noah Harari",
    descripcion: "Historia de la humanidad desde la Edad de Piedra",
    precio: 21.99,
    categoria: "Libros",
    stock: 40,
    marca: "Harper",
    sku: "LIB-0009",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Subtle Art of Not Giving a F*ck",
    descripcion: "Enfoque contracultural para vivir una buena vida",
    precio: 16.99,
    categoria: "Libros",
    stock: 85,
    marca: "HarperOne",
    sku: "LIB-0010",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "1984 - George Orwell",
    descripcion: "Novela distópica clásica sobre vigilancia totalitaria",
    precio: 13.99,
    categoria: "Libros",
    stock: 95,
    marca: "Signet Classics",
    sku: "LIB-0011",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Silent Patient - Alex Michaelides",
    descripcion: "Thriller psicológico sobre una mujer que no habla",
    precio: 16.99,
    categoria: "Libros",
    stock: 50,
    marca: "Celadon Books",
    sku: "LIB-0012",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Recursion - Blake Crouch",
    descripcion: "Novela de ciencia ficción sobre memoria y realidad",
    precio: 17.99,
    categoria: "Libros",
    stock: 30,
    marca: "Crown",
    sku: "LIB-0013",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Power of Now - Eckhart Tolle",
    descripcion: "Guía espiritual para la iluminación personal",
    precio: 16.99,
    categoria: "Libros",
    stock: 55,
    marca: "New World Library",
    sku: "LIB-0014",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Born a Crime - Trevor Noah",
    descripcion: "Memoria del comediante sobre crecer en Sudáfrica",
    precio: 17.99,
    categoria: "Libros",
    stock: 48,
    marca: "Spiegel & Grau",
    sku: "LIB-0015",
    activo: true,
    fechaCreacion: new Date()
  },
  // Belleza (10 productos para completar 100)
  {
    nombre: "Clinique Dramatically Different Moisturizer",
    descripcion: "Loción hidratante para todo tipo de piel 125ml",
    precio: 32.50,
    categoria: "Belleza",
    stock: 50,
    marca: "Clinique", 
    sku: "BEL-0001",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "The Ordinary Niacinamide 10% + Zinc 1%",
    descripcion: "Serum para reducir imperfecciones y controlar grasa",
    precio: 7.90,
    categoria: "Belleza",
    stock: 100,
    marca: "The Ordinary",
    sku: "BEL-0002",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Fenty Beauty Gloss Bomb",
    descripcion: "Brillo labial universal con fórmula no pegajosa",
    precio: 20.00,
    categoria: "Belleza",
    stock: 85,
    marca: "Fenty Beauty",
    sku: "BEL-0003",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Dyson Airwrap Complete Styler",
    descripcion: "Estilizador multifuncional con tecnología Coanda",
    precio: 599.99,
    categoria: "Belleza",
    stock: 8,
    marca: "Dyson",
    sku: "BEL-0004",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Charlotte Tilbury Magic Cream",
    descripcion: "Crema hidratante con efecto lifting instantáneo",
    precio: 100.00,
    categoria: "Belleza",
    stock: 25,
    marca: "Charlotte Tilbury",
    sku: "BEL-0005",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Rare Beauty Soft Pinch Blush",
    descripcion: "Rubor líquido de larga duración fácil de difuminar",
    precio: 23.00,
    categoria: "Belleza",
    stock: 65,
    marca: "Rare Beauty",
    sku: "BEL-0006",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Glossier Boy Brow",
    descripcion: "Gel para cejas con tinte que define y fija",
    precio: 20.00,
    categoria: "Belleza",
    stock: 70,
    marca: "Glossier",
    sku: "BEL-0007",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Drunk Elephant C-Firma Day Serum",
    descripcion: "Serum de vitamina C antioxidante para el día",
    precio: 80.00,
    categoria: "Belleza",
    stock: 35,
    marca: "Drunk Elephant",
    sku: "BEL-0008",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Olaplex No.3 Hair Perfector",
    descripcion: "Tratamiento capilar reparador para usar en casa",
    precio: 28.00,
    categoria: "Belleza",
    stock: 60,
    marca: "Olaplex",
    sku: "BEL-0009",
    activo: true,
    fechaCreacion: new Date()
  },
  {
    nombre: "Maybelline Sky High Mascara",
    descripcion: "Máscara de pestañas con efecto volumen y longitud",
    precio: 10.99,
    categoria: "Belleza",
    stock: 120,
    marca: "Maybelline",
    sku: "BEL-0010",
    activo: true,
    fechaCreacion: new Date()
  }
];

print("🚀 Inicializando base de datos con 100 productos reales...");

// Insertar productos con optimización para MongoDB 8.0
const result = db.productos.insertMany(productos, {
  writeConcern: { w: 1, j: true },
  ordered: false
});

print(`📦 Insertados ${result.insertedIds.length} productos correctamente`);

// Crear índices optimizados para MongoDB 8.0  
print("🔍 Creando índices optimizados...");

db.productos.createIndex({ "sku": 1 }, { unique: true, name: "idx_sku_unique" });
db.productos.createIndex({ "categoria": 1 }, { name: "idx_categoria" });
db.productos.createIndex({ "precio": 1 }, { name: "idx_precio" });
db.productos.createIndex({ "stock": 1 }, { name: "idx_stock" });
db.productos.createIndex({ "marca": 1 }, { name: "idx_marca" });
db.productos.createIndex({ "nombre": "text", "descripcion": "text" }, { name: "idx_busqueda_texto" });
db.productos.createIndex({ "categoria": 1, "precio": 1 }, { name: "idx_categoria_precio" });
db.productos.createIndex({ "marca": 1, "categoria": 1 }, { name: "idx_marca_categoria" });
db.productos.createIndex({ "activo": 1, "stock": 1 }, { name: "idx_activo_stock" });

print("✅ Índices creados exitosamente");

// Verificación final
const count = db.productos.countDocuments();
print(`\n📊 Total productos insertados: ${count}`);

// Estadísticas por categoría
print("\n📈 PRODUCTOS POR CATEGORÍA:");
const categoriaStats = db.productos.aggregate([
  {
    $group: {
      _id: "$categoria",
      total: { $sum: 1 },
      precioPromedio: { $avg: "$precio" },
      stockTotal: { $sum: "$stock" }
    }
  },
  { $sort: { total: -1 } }
]).toArray();

categoriaStats.forEach(cat => {
  print(`${cat._id}: ${cat.total} productos, Precio promedio: $${cat.precioPromedio.toFixed(2)}, Stock total: ${cat.stockTotal}`);
});

print("\n🎉 ¡Base de datos inicializada exitosamente con productos reales!");