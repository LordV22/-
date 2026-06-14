FROM node:23-alpine

# ആവശ്യമായ എല്ലാ ടൂളുകളും കറക്റ്റ് ആയി ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    curl \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    pixman-dev \
    pkgconfig \
    g++ \
    make

# yt-dlp ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN pip3 install yt-dlp --break-system-packages

WORKDIR /home/container

COPY package*.json ./
# canvas കംപൈൽ ചെയ്യാൻ ആവശ്യമായ ടൂളുകൾ അവിടെയുണ്ട്
RUN npm install --build-from-source

COPY . .

CMD ["node", "index.js"]