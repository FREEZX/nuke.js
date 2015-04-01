FROM iojs:latest

WORKDIR /home/nukejs
ADD . /home/nukejs
ENV NODE_ENV production
RUN npm install --unsafe-perm

EXPOSE 3000
CMD ["npm", "start"]
