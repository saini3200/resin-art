const whatsappNumber = '+918397903160';
const whatsappBase = `https://wa.me/${whatsappNumber}`;
const productPreviewImages = {
  'Resin Frame': 'image2.png',
  'Resin Key Chain': 'image1.png',
  'Resin Varmala Preservation': 'image3.png',
  'Resin Bookmark': 'image5.png',
  'Resin Photo Keychain': 'image4.png',
  'Resin Tissue Holder': 'image5.png',
  'Alphabet Key Chain': 'image1.png',
  'Wedding Card Preservation': 'image4.png',
  'Customised Ring Plate': 'image3.png',
  'Resin Pooja Thali': 'image6.png',
  'Resin Name Board': 'image5.png',
  'Car Hanging': 'image6.png',
  'Dashboard': 'image4.png'
};

const header = document.querySelector('.site-header');
const backToTopButton = document.getElementById('backToTop');
const observerOptions = { threshold: 0.18 };

function getProductPreviewImage(product) {
  return productPreviewImages[product] || 'image4.png';
}

// Slider variables
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slider img');
const dotsContainer = document.querySelector('.slider-dots');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
let autoSlideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function createDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function initSlider() {
  if (slides.length === 0) return;
  createDots();
  showSlide(0);
  startAutoSlide();

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

function orderNow() {
  const message = 'Hello Resin Creations, I would like to inquire about a custom resin order.';
  window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, '_blank');
}

function buyProduct(product, price) {
  const amount = price ? `₹${price}` : '₹0';
  const message = `Hi, I want to order ${product} for ${amount}`;
  window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, '_blank');
}

function openImage(element) {
  const imageSrc = element.tagName === 'IMG'
    ? element.src
    : element.querySelector('img')?.src;

  if (!imageSrc) return;

  const popup = document.getElementById('popup');
  const popupImg = document.getElementById('popup-img');
  popupImg.src = imageSrc;
  popup.style.display = 'grid';
}

function closeImage() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

function getColorNameFromHex(hex) {
  const normalized = String(hex || '').trim().toLowerCase();
  const names = {
    '#d9b35f': 'golden',
    '#289a65': 'forest green',
    '#ffffff': 'white',
    '#000000': 'black',
    '#ff0000': 'red',
    '#00ff00': 'green',
    '#0000ff': 'blue',
    '#f9f7f5': 'cream',
    '#c4a484': 'champagne'
  };
  if (names[normalized]) return names[normalized];
  if (!/^#[0-9a-f]{6}$/i.test(normalized)) return 'custom color';

  const rgb = parseInt(normalized.slice(1), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;

  if (r > g && r > b) return 'warm red tone';
  if (g > r && g > b) return 'green tone';
  if (b > r && b > g) return 'cool blue tone';
  if (r + g + b > 600) return 'light tone';
  return 'custom color';
}

function sendOrder(event) {
  event.preventDefault();

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const product = document.getElementById('product-select').value;
  const size = document.getElementById('size-select').value;
  const customText = document.getElementById('custom-text').value.trim();
  const color = document.getElementById('productColor').value;
  const address = document.getElementById('delivery-address').value.trim();
  const deliveryDate = document.getElementById('delivery-date').value;
  const instructions = document.getElementById('special-instructions').value.trim();
  const photoInput = document.getElementById('photoUpload');

  if (!name || !phone || !product) {
    alert('Please enter your name, phone number, and select a product.');
    return;
  }

  const colorLabel = getColorNameFromHex(color);
  const photoUploaded = photoInput && photoInput.files.length > 0;
  let message = `Hi, I want to order:`;
  message += `\nName: ${name}`;
  message += `\nPhone: ${phone}`;
  message += `\nProduct: ${product}`;
  message += `\nSize: ${size}`;
  message += `\nColor: ${colorLabel}`;
  message += `\nCustom Text: ${customText || 'None'}`;
  if (address) {
    message += `\nDelivery Address: ${address}`;
  }
  if (deliveryDate) {
    message += `\nPreferred Delivery Date: ${deliveryDate}`;
  }
  if (instructions) {
    message += `\nSpecial Instructions: ${instructions}`;
  }
  if (photoUploaded) {
    message += `\nPhoto: ${photoInput.files[0].name}`;
    message += `\n\nImportant: the uploaded image appears in the preview, but WhatsApp cannot attach files automatically. After WhatsApp opens, please attach the same photo from your device gallery.`;
  }

  saveEnquiry({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name,
    phone,
    product,
    size,
    colorLabel,
    customText,
    address,
    deliveryDate,
    instructions,
    photoName: photoUploaded ? photoInput.files[0].name : null,
    photoData: photoUploaded && uploadedImage ? uploadedImage.src : null,
    message,
    status: 'pending'
  });

  window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, '_blank');
}

function getStoredEnquiries() {
  const raw = localStorage.getItem('resinEnquiries');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function saveEnquiry(enquiry) {
  const enquiries = getStoredEnquiries();
  enquiries.unshift(enquiry);
  localStorage.setItem('resinEnquiries', JSON.stringify(enquiries.slice(0, 50)));
}

function updateUploadedPhotoPreview() {
  const previewThumb = document.getElementById('preview-uploaded-thumb');
  const previewUploadedPanel = document.getElementById('preview-uploaded-container');
  const photoInput = document.getElementById('photoUpload');
  const photoFile = photoInput && photoInput.files.length > 0 ? photoInput.files[0] : null;

  if (previewUploadedPanel && previewThumb) {
    if (photoFile && uploadedImage) {
      previewUploadedPanel.classList.remove('hidden');
      previewThumb.src = uploadedImage.src;
      previewThumb.alt = photoFile.name;
      previewThumb.style.cursor = 'pointer';
      previewThumb.onclick = () => openUploadedImageViewer(uploadedImage.src, photoFile.name);
    } else {
      previewUploadedPanel.classList.add('hidden');
      previewThumb.src = '';
      previewThumb.alt = '';
      previewThumb.onclick = null;
    }
  }
}

function openUploadedImageViewer(imageSrc, imageName) {
  const modal = document.getElementById('uploaded-image-modal');
  const modalImage = document.getElementById('modal-uploaded-image');
  const modalImageName = document.getElementById('modal-image-filename');

  if (modal && modalImage && modalImageName) {
    modalImage.src = imageSrc;
    modalImageName.textContent = imageName;
    modal.style.display = 'grid';
  }
}

function closeUploadedImageViewer() {
  const modal = document.getElementById('uploaded-image-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function updateOrderSummary() {
  const product = document.getElementById('product-select')?.value || 'Select a product';
  const size = document.getElementById('size-select')?.value || 'Medium';
  const color = document.getElementById('productColor')?.value || '#D9B35F';
  const customText = document.getElementById('custom-text')?.value.trim() || 'None';
  const address = document.getElementById('delivery-address')?.value.trim() || 'Not added';
  const deliveryDate = document.getElementById('delivery-date')?.value || 'Not selected';
  const instructions = document.getElementById('special-instructions')?.value.trim() || 'None';
  const photoInput = document.getElementById('photoUpload');
  const colorLabel = getColorNameFromHex(color);
  const photoLabel = photoInput && photoInput.files.length > 0
    ? photoInput.files[0].name
    : uploadedImage ? 'Uploaded' : 'Not uploaded';

  const previewProductImage = document.getElementById('preview-product-image');
  const previewProductName = document.getElementById('preview-product-name');
  const previewProductSize = document.getElementById('preview-product-size');
  const previewColorName = document.getElementById('preview-color-name');
  const previewColorSwatch = document.getElementById('preview-color-swatch');
  const previewCustomText = document.getElementById('preview-custom-text');
  const previewDeliveryDate = document.getElementById('preview-delivery-date');
  const previewInstructions = document.getElementById('preview-instructions');
  const previewTextOverlay = document.getElementById('preview-text-overlay');

  if (previewProductImage) {
    previewProductImage.src = getProductPreviewImage(product);
    previewProductImage.alt = product ? `${product} preview` : 'Selected resin product preview';
  }
  if (previewProductName) previewProductName.textContent = product;
  if (previewProductSize) previewProductSize.textContent = size;
  if (previewColorName) previewColorName.textContent = colorLabel;
  if (previewColorSwatch) previewColorSwatch.style.background = color;
  if (previewCustomText) previewCustomText.textContent = customText;
  if (previewDeliveryDate) previewDeliveryDate.textContent = deliveryDate;
  if (previewInstructions) previewInstructions.textContent = instructions;
  if (previewTextOverlay) {
    previewTextOverlay.textContent = customText !== 'None' ? customText : 'Your custom text appears here';
    previewTextOverlay.classList.toggle('preview-text-empty', customText === 'None');
  }

  updateUploadedPhotoPreview();
}

function handleScroll() {
  const hasScrolled = window.scrollY > 16;
  header.classList.toggle('scrolled', hasScrolled);
  backToTopButton.classList.toggle('show', window.scrollY > 450);
}

function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => observer.observe(element));
}

function updateCustomizationFieldUI() {
  const colorInput = document.getElementById('productColor');
  const colorValue = document.getElementById('color-value');
  if (colorInput && colorValue) {
    colorValue.textContent = getColorNameFromHex(colorInput.value);
  }

  const photoInput = document.getElementById('photoUpload');
  const photoName = document.getElementById('photoUploadName');
  if (photoInput && photoName) {
    photoName.textContent = photoInput.files.length > 0
      ? photoInput.files[0].name
      : 'JPG / PNG · Optional';
  }
}

function initSiteIntro() {
  const intro = document.getElementById('siteIntro');
  if (!intro) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alreadySeen = false;

  try {
    alreadySeen = sessionStorage.getItem('resinIntroSeen') === '1';
  } catch (error) {
    alreadySeen = false;
  }

  if (reduceMotion || alreadySeen) {
    intro.classList.add('intro-hidden');
    document.body.classList.remove('intro-active');
    return;
  }

  document.body.classList.add('intro-active');

  try {
    sessionStorage.setItem('resinIntroSeen', '1');
  } catch (error) {
    // Continue without persistence when storage is unavailable.
  }

  window.setTimeout(() => {
    intro.classList.add('intro-hidden');
    document.body.classList.remove('intro-active');
  }, 3000);
}

function initMobileNavigation() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('primary-navigation');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  };

  toggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', event => {
    if (!document.body.classList.contains('menu-open')) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function initPage() {
  initSiteIntro();
  initSlider();
  initMobileNavigation();
  setupScrollAnimations();

  document.querySelectorAll('.product-card, .gallery-grid img').forEach(element => {
    element.addEventListener('click', (event) => {
      if (event.target.tagName.toLowerCase() !== 'button') {
        openImage(event.currentTarget);
      }
    });
  });

  const customTextInput = document.getElementById('custom-text');
  const colorInput = document.getElementById('productColor');
  const productSelect = document.getElementById('product-select');
  const sizeSelect = document.getElementById('size-select');
  const phoneInput = document.getElementById('customer-phone');
  const addressInput = document.getElementById('delivery-address');
  const deliveryDateInput = document.getElementById('delivery-date');
  const instructionsInput = document.getElementById('special-instructions');

  if (customTextInput) customTextInput.addEventListener('input', updateOrderSummary);
  if (colorInput) colorInput.addEventListener('input', updateOrderSummary);
  if (productSelect) productSelect.addEventListener('change', updateOrderSummary);
  if (sizeSelect) sizeSelect.addEventListener('change', updateOrderSummary);
  if (phoneInput) phoneInput.addEventListener('input', updateOrderSummary);
  if (addressInput) addressInput.addEventListener('input', updateOrderSummary);
  if (deliveryDateInput) deliveryDateInput.addEventListener('change', updateOrderSummary);
  if (instructionsInput) instructionsInput.addEventListener('input', updateOrderSummary);

  const photoInput = document.getElementById('photoUpload');
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      updateCustomizationFieldUI();
      updateOrderSummary();
    });
  }

  const choosePhotoButton = document.getElementById('choosePhotoButton');
  if (choosePhotoButton && photoInput) {
    choosePhotoButton.addEventListener('click', () => photoInput.click());
  }

  if (colorInput) {
    colorInput.addEventListener('input', updateCustomizationFieldUI);
    colorInput.addEventListener('change', updateCustomizationFieldUI);
  }

  updateCustomizationFieldUI();
  updateOrderSummary();
}

window.addEventListener('DOMContentLoaded', () => {
  initPage();
  setTimeout(() => {
    document.body.classList.add('page-ready');
  }, 100);
});

window.addEventListener('scroll', handleScroll);

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeImage();
  }
});

// ===== CANVAS-BASED PRODUCT PREVIEW =====
let uploadedImage = null;

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  const isImageFile = file && (file.type.startsWith('image/') || /\.(png|jpe?g|jfif|jpe|heic|heif|gif|webp|bmp|svg)$/i.test(file.name));
  if (!isImageFile) {
    alert('Please select a valid image file (jpg, png, gif, webp, bmp, svg).');
    event.target.value = '';
    updateCustomizationFieldUI();
    return;
  }

  updateCustomizationFieldUI();

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const maxSize = 800;
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height >= width && height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const resizedDataURL = canvas.toDataURL('image/jpeg', 0.8);
      const resizedImg = new Image();
      resizedImg.onload = function() {
        uploadedImage = resizedImg;
        const productSelect = document.getElementById('product-select');
        if (productSelect && !productSelect.value) {
          productSelect.value = 'Resin Photo Keychain';
        }
        updateOrderSummary();
      };
      resizedImg.src = resizedDataURL;
    };
    img.onerror = function() {
      alert('Unable to load the selected image. Please try a different file.');
    };
    img.src = e.target.result;
  };
  reader.onerror = function() {
    alert('Unable to read the selected file. Please try again.');
  };
  reader.readAsDataURL(file);
}

function initPreview() {
  const canvas = document.getElementById('previewCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let rotation = 0;
  let currentProduct = 'Resin Key Chain';
  let currentColor = '#D9B35F';
  let isDragging = false;
  let prevX = 0;
  let autoRotate = true;
  let lastTime = 0;

  const drawResinLayer = function(x, y, width, height, depth, color, opacity, isEpoxy = false) {
    ctx.save();
    ctx.globalAlpha = opacity;

    // Add realistic resin glow
    ctx.shadowColor = color;
    ctx.shadowBlur = depth * 0.8;
    ctx.shadowOffsetX = depth * 0.1;
    ctx.shadowOffsetY = depth * 0.1;

    // Create realistic resin surface with multiple curves
    ctx.beginPath();
    const curve1 = depth * 0.4;
    const curve2 = depth * 0.2;
    ctx.moveTo(x, y + curve1);

    // Top curve
    ctx.quadraticCurveTo(x + width/2, y - curve1, x + width, y + curve1);

    // Right side with slight bulge
    ctx.lineTo(x + width + curve2, y + height/2);
    ctx.quadraticCurveTo(x + width, y + height - curve1, x + width, y + height - curve1);

    // Bottom curve
    ctx.quadraticCurveTo(x + width/2, y + height + curve1, x, y + height - curve1);

    // Left side with slight bulge
    ctx.lineTo(x - curve2, y + height/2);
    ctx.quadraticCurveTo(x, y + curve1, x, y + curve1);

    ctx.closePath();

    // Fill with resin color gradient
    const resinGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    resinGradient.addColorStop(0, color);
    resinGradient.addColorStop(0.3, lightenColor(color, 20));
    resinGradient.addColorStop(0.7, color);
    resinGradient.addColorStop(1, darkenColor(color, 15));
    ctx.fillStyle = resinGradient;
    ctx.fill();

    // Add epoxy-like shine if specified
    if (isEpoxy) {
      const shineGradient = ctx.createRadialGradient(
        x + width/2, y + height/3, 0,
        x + width/2, y + height/3, width/2
      );
      shineGradient.addColorStop(0, `rgba(255,255,255,${0.4 * opacity})`);
      shineGradient.addColorStop(0.4, `rgba(255,255,255,${0.2 * opacity})`);
      shineGradient.addColorStop(1, `rgba(255,255,255,${0.05 * opacity})`);
      ctx.fillStyle = shineGradient;
      ctx.fill();
    }

    // Add resin texture/bubbles
    for (let i = 0; i < Math.floor(depth / 2); i++) {
      const bx = x + Math.random() * width;
      const by = y + Math.random() * height;
      const br = 0.5 + Math.random() * 1.5;
      ctx.save();
      ctx.globalAlpha = (0.1 + Math.random() * 0.2) * opacity;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  // Helper functions for color manipulation
  function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }

  function draw3DImage(image, x, y, width, height, depth) {
    ctx.save();

    // Create advanced 3D perspective with resin-like distortion
    const perspectiveX = depth * 0.08;
    const perspectiveY = depth * 0.05;
    ctx.setTransform(1, perspectiveY, perspectiveX, 1, 0, 0);

    // Draw the main image
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(image, x, y, width, height);

    // Add realistic resin overlay with multiple layers
    ctx.globalCompositeOperation = 'overlay';

    // First resin layer - subtle color tinting
    const resinTint = ctx.createLinearGradient(x, y, x + width, y + height);
    resinTint.addColorStop(0, 'rgba(255,255,255,0.1)');
    resinTint.addColorStop(0.5, 'rgba(255,255,255,0.05)');
    resinTint.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = resinTint;
    ctx.fillRect(x, y, width, height);

    // Second resin layer - depth enhancement
    ctx.globalCompositeOperation = 'soft-light';
    const depthGradient = ctx.createRadialGradient(
      x + width/2, y + height/2, 0,
      x + width/2, y + height/2, Math.max(width, height)/2
    );
    depthGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    depthGradient.addColorStop(0.7, 'rgba(255,255,255,0.1)');
    depthGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = depthGradient;
    ctx.fillRect(x, y, width, height);

    // Add realistic resin bubbles/reflections
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < Math.floor(depth / 3); i++) {
      const bx = x + Math.random() * width;
      const by = y + Math.random() * height;
      const br = 1 + Math.random() * 3;
      const alpha = 0.1 + Math.random() * 0.2;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Add subtle vignette effect for depth
    ctx.globalCompositeOperation = 'multiply';
    const vignette = ctx.createRadialGradient(
      x + width/2, y + height/2, 0,
      x + width/2, y + height/2, Math.max(width, height) * 0.7
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.8, 'rgba(0,0,0,0.1)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = vignette;
    ctx.fillRect(x, y, width, height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    const r = typeof radius === 'number' ? radius : 0;
    context.beginPath();
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
  }

  function drawResinFrame(x, y, width, height, thickness) {
    ctx.save();

    // Outer frame
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = thickness;
    ctx.strokeRect(x, y, width, height);

    // Inner shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = thickness * 0.5;
    ctx.strokeRect(x + thickness/2, y + thickness/2, width - thickness, height - thickness);

    // Highlight edge
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);

    ctx.restore();
  }

  function drawKeyChain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation);

    // Enhanced metal ring with realistic 3D effect
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;

    // Ring base
    const ringGradient = ctx.createRadialGradient(0, -70, 0, 0, -70, 25);
    ringGradient.addColorStop(0, '#c4a484');
    ringGradient.addColorStop(0.7, '#8b7355');
    ringGradient.addColorStop(1, '#654321');
    ctx.fillStyle = ringGradient;
    ctx.beginPath();
    ctx.arc(0, -70, 20, 0, Math.PI * 2);
    ctx.fill();

    // Ring inner shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -70, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Ring highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -70, 19, -Math.PI/3, Math.PI/3);
    ctx.stroke();

    ctx.restore();

    // Realistic chain link with depth
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Chain link body
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Chain link highlights
    ctx.strokeStyle = '#a0855a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.lineTo(0, -2);
    ctx.stroke();

    ctx.restore();

    // Professional resin pendant with multiple layers
    // Base resin layer (deepest)
    drawResinLayer(-38, -5, 76, 110, 12, currentColor, 0.95, true);

    // Middle resin layer
    drawResinLayer(-36, -2, 72, 105, 10, lightenColor(currentColor, 10), 0.85, true);

    // Top resin layer (shallowest)
    drawResinLayer(-34, 1, 68, 100, 8, lightenColor(currentColor, 20), 0.75, true);

    // Embedded photo with realistic resin encapsulation
    if (uploadedImage) {
      ctx.save();

      // Create resin "window" with beveled edges
      drawRoundedRect(ctx, -30, 10, 60, 80, 8);
      ctx.clip();

      // Draw the uploaded photo inside the resin window
      draw3DImage(uploadedImage, -30, 10, 60, 80, 15);
      ctx.restore();

      // Add resin encapsulation frame
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-30, 10, 60, 80);

      // Inner highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-29, 11, 58, 78);
      ctx.restore();

      // Add realistic resin bubbles around the photo
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 25 + Math.random() * 35;
        const bx = Math.cos(angle) * distance;
        const by = Math.sin(angle) * distance;
        const br = 1 + Math.random() * 3;

        ctx.save();
        ctx.globalAlpha = 0.4 + Math.random() * 0.3;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();

        // Bubble highlight
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.arc(bx - br/3, by - br/3, br/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Default resin art design when no photo
      ctx.save();

      // Create intricate resin pattern
      ctx.fillStyle = '#f2e4ca';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('RC', 0, 40);

      // Add decorative resin elements
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 25;
        const y = Math.sin(angle) * 25 + 20;
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  function drawPoojaThali() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation);

    // Professional resin thali base with multiple layers
    // Base layer (deepest)
    drawResinLayer(-85, -85, 170, 170, 15, currentColor, 0.95, true);

    // Middle layer
    drawResinLayer(-80, -80, 160, 160, 12, lightenColor(currentColor, 8), 0.85, true);

    // Top layer (shallowest)
    drawResinLayer(-75, -75, 150, 150, 10, lightenColor(currentColor, 15), 0.75, true);

    // Enhanced outer ring with metallic finish
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;

    // Outer metallic ring
    const metalGradient = ctx.createRadialGradient(0, 0, 75, 0, 0, 95);
    metalGradient.addColorStop(0, '#d4af37');
    metalGradient.addColorStop(0.5, '#b8860b');
    metalGradient.addColorStop(1, '#8b6914');
    ctx.fillStyle = metalGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.fill();

    // Ring inner shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 87, 0, Math.PI * 2);
    ctx.stroke();

    // Ring highlight
    ctx.strokeStyle = 'rgba(255,215,0,0.8)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 88, -Math.PI/4, Math.PI/4);
    ctx.stroke();

    ctx.restore();

    // Central resin design area
    if (uploadedImage) {
      ctx.save();

      // Create professional circular resin "lens" with beveled effect
      ctx.beginPath();
      ctx.arc(0, 0, 65, 0, Math.PI * 2);
      ctx.clip();

      // Draw photo with advanced 3D resin encapsulation
      ctx.save();
      // Add slight perspective distortion for realism
      ctx.setTransform(1, 0.05, 0.05, 1, 0, 0);
      draw3DImage(uploadedImage, -65, -65, 130, 130, 18);
      ctx.restore();

      ctx.restore();

      // Professional resin frame around photo
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 63, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 62, 0, Math.PI * 2);
      ctx.stroke();

      // Inner highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 61, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Add professional resin bubbles around the photo
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 25 + Math.random() * 35;
        const bx = Math.cos(angle) * distance;
        const by = Math.sin(angle) * distance;
        const br = 1.5 + Math.random() * 3;

        ctx.save();
        ctx.globalAlpha = 0.5 + Math.random() * 0.3;
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();

        // Bubble highlight for realism
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.arc(bx - br/3, by - br/3, br/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Professional default resin design
      ctx.save();

      // Central mandala pattern in resin
      ctx.fillStyle = '#f7e7c3';
      ctx.beginPath();
      ctx.arc(0, 0, 65, 0, Math.PI * 2);
      ctx.fill();

      // Intricate resin mandala design
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 60, Math.sin(angle) * 60);
        ctx.stroke();
      }

      // Inner decorative circles
      for (let r = 20; r < 60; r += 15) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central resin "gem"
      const gemGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
      gemGradient.addColorStop(0, '#ffdd55');
      gemGradient.addColorStop(0.7, '#d4af37');
      gemGradient.addColorStop(1, '#b8860b');
      ctx.fillStyle = gemGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Traditional diya with enhanced resin effect
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    // Diya base with resin coating
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.ellipse(-40, -20, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Diya body
    ctx.fillStyle = '#daa520';
    ctx.beginPath();
    ctx.ellipse(-40, -25, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flame with realistic glow
    const flameGradient = ctx.createRadialGradient(-40, -35, 0, -40, -35, 12);
    flameGradient.addColorStop(0, '#fff8dc');
    flameGradient.addColorStop(0.3, '#ffd700');
    flameGradient.addColorStop(0.7, '#ff8c00');
    flameGradient.addColorStop(1, '#ff4500');
    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.ellipse(-40, -35, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Final professional resin overlay
    const finalOverlay = ctx.createRadialGradient(0, 0, 0, 0, 0, 95);
    finalOverlay.addColorStop(0, 'rgba(255,255,255,0.4)');
    finalOverlay.addColorStop(0.4, 'rgba(255,255,255,0.2)');
    finalOverlay.addColorStop(0.8, 'rgba(255,255,255,0.1)');
    finalOverlay.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = finalOverlay;
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawGenericResinProduct(productName) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const width = 220;
    const height = 140;
    const depth = 18;

    // Soft drop shadow for product body
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#f7f0dc';
    drawRoundedRect(ctx, -width/2, -height/2, width, height, 18);
    ctx.fill();
    ctx.restore();

    // Resin surface
    drawResinLayer(-width/2, -height/2, width, height, depth, currentColor, 0.88, true);
    drawResinLayer(-width/2 + 4, -height/2 + 4, width - 8, height - 8, depth - 4, lightenColor(currentColor, 12), 0.75, true);

    if (uploadedImage) {
      ctx.save();
      drawRoundedRect(ctx, -width/2 + 10, -height/2 + 10, width - 20, height - 20, 14);
      ctx.clip();
      draw3DImage(uploadedImage, -width/2 + 10, -height/2 + 10, width - 20, height - 20, 20);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, -width/2 + 10, -height/2 + 10, width - 20, height - 20, 14);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#ffffffcc';
      ctx.font = '600 18px Poppins, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload a photo', 0, -10);
      ctx.fillText('to preview', 0, 25);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = '#333';
    ctx.font = '600 16px Poppins, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(productName, 0, height/2 + 30);
    ctx.restore();

    ctx.restore();
  }

  function animate(currentTime = 0) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const product = document.getElementById('product-select')?.value || currentProduct;
    const color = document.getElementById('productColor')?.value || currentColor;

    currentProduct = product;
    currentColor = color;

    // Auto-rotate when not dragging
    if (autoRotate && !isDragging) {
      rotation += deltaTime * 0.0005; // Slow, smooth rotation
    }

    const lowerProduct = product.toLowerCase();
    const isKeyChainProduct = lowerProduct.includes('key chain') || lowerProduct.includes('keychain');
    const isThaliProduct = lowerProduct.includes('pooja thali') || lowerProduct.includes('thali');

    if (isKeyChainProduct) {
      drawKeyChain();
    } else if (isThaliProduct) {
      drawPoojaThali();
    } else {
      drawGenericResinProduct(product || 'Custom Resin Product');
    }

    requestAnimationFrame(animate);
  }

  // Mouse controls
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoRotate = false;
    prevX = e.clientX;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.clientX - prevX;
    rotation += delta * 0.01;
    prevX = e.clientX;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    setTimeout(() => autoRotate = true, 2000); // Resume auto-rotate after 2 seconds
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    setTimeout(() => autoRotate = true, 2000);
  });

  // Touch controls
  canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    autoRotate = false;
    prevX = e.touches[0].clientX;
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - prevX;
    rotation += delta * 0.01;
    prevX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', () => {
    isDragging = false;
    setTimeout(() => autoRotate = true, 2000);
  });

  // Listen for preview refresh events
  canvas.addEventListener('previewRefresh', () => {
    // Force a redraw by calling animate once
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const product = document.getElementById('product-select')?.value || currentProduct;
    const color = document.getElementById('productColor')?.value || currentColor;

    currentProduct = product;
    currentColor = color;

    const lowerProduct = product.toLowerCase();
    const isKeyChainProduct = lowerProduct.includes('key chain') || lowerProduct.includes('keychain');
    const isThaliProduct = lowerProduct.includes('pooja thali') || lowerProduct.includes('thali');

    if (isKeyChainProduct) {
      drawKeyChain();
    } else if (isThaliProduct) {
      drawPoojaThali();
    } else {
      drawGenericResinProduct(product || 'Custom Resin Product');
    }
  });

  animate();
}

window.updatePreview = function() {
  updateOrderSummary();
  const canvas = document.getElementById('previewCanvas');
  if (!canvas) return;
  canvas.dispatchEvent(new Event('previewRefresh'));
};

// Initialize preview when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPreview);
} else {
  initPreview();
}
