'use strict';

const util = require('../../../src/util/hash');
const Future = require('fluture');
const {range, curry2} = require('../../../src/prelude');

describe('Hashing utililities', () => {

  const words = 'the quick brown fox jumped over the lazy dog'.split(' ');

  const assertHash = v => {
    expect(v).to.be.a('string');
    expect(v).to.have.length(32);
    expect(v).not.to.match(/[^0-9a-f]/);
  };

  describe('.strToInt()', () => {

    const assertInteger = v => {
      expect(v).to.be.a('number');
      expect(v % 1).to.equal(0);
    };

    it('creates integers', () => {
      words.forEach(v => assertInteger(util.strToInt(v)));
    });

    it('returns 0 for empty strings', () => {
      const r = util.strToInt('');
      assertInteger(r);
      expect(r).to.equal(0);
    });

  });

  describe('.hexmd5()', () => {

    it('creates hashes', () => {
      words.forEach(v => assertHash(util.hexmd5(v)));
    });

  });

  describe('.objectToString()', () => {

    it('creates hashes', () => {
      const objects = words.map(word => ({key: word}));
      objects.forEach(v => assertHash(util.objectToString(v)));
    });

  });

  describe('.randomString()', () => {

    it('returns a Future', () => {
      expect(util.randomString(4)).to.be.an.instanceof(Future);
    });

    it('resolves with a string', done => {
      util.randomString(4).fork(done, v => {
        expect(v).to.be.a('string');
        done();
      });
    });

    it('string always has the right length', done => {
      const fs = range(0, 32).map(l => util.randomString(l).map(s => expect(s).to.have.length(l)));
      Future.parallel(Infinity, fs).fork(done, curry2(done, null));
    });

  });

});
