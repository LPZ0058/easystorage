import { expect } from 'chai'
import EYStorage from '../src/index'
import { EYStorageTypeOptions, instanceConfig } from '../src/types'





describe('测试EYStorage', function() {
  const config:instanceConfig = {
    storageType: EYStorageTypeOptions.LOCALSTORAGE,
    prefix: 'dev',
    expire: 24 * 60 * 60 * 1000,
    isEncrypt: true,
    isRenewal: false
  }
  EYStorage.config = config
  const storage = new EYStorage()
  describe('测试isSupported函数',function(){
    it('当前环境应该支持localStorage',function(){
      expect(storage.isSupported()).to.be.equal(true)
    })
  })
  describe('测试new同一域下的不同对象是否为同一个',function(){
    it('测试new localstorage 前缀为1的不同对象其实是同一个 ',function(){
      const storage1 = new EYStorage({
        prefix:'1',
        storageType:EYStorageTypeOptions.LOCALSTORAGE
      })
      const storage2 = new EYStorage({
        prefix:'1',
        storageType:EYStorageTypeOptions.LOCALSTORAGE
      })
      expect(storage1).to.be.equal(storage2)
    })
    it('测试new sessionlstorage 前缀为1的不同对象其实是同一个 ',function(){
      const storage1 = new EYStorage({
        prefix:'1',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      const storage2 = new EYStorage({
        prefix:'1',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      expect(storage1).to.be.equal(storage2)
    })
    it('测试new localstorage 前缀为2的不同对象其实是同一个 ',function(){
      const storage1 = new EYStorage({
        prefix:'2',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      const storage2 = new EYStorage({
        prefix:'2',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      expect(storage1).to.be.equal(storage2)
    })
    it('测试new sessionlstorage 前缀为2的不同对象其实是同一个 ',function(){
      const storage1 = new EYStorage({
        prefix:'2',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      const storage2 = new EYStorage({
        prefix:'2',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      expect(storage1).to.be.equal(storage2)
    })
    it('测试new sessionlstorage 前缀为2的和new localstorage 前缀为2的对象不是同一个 ',function(){
      const storage1 = new EYStorage({
        prefix:'2',
        storageType:EYStorageTypeOptions.SESSIONSTORAGE
      })
      const storage2 = new EYStorage({
        prefix:'2',
        storageType:EYStorageTypeOptions.LOCALSTORAGE
      })
      expect(storage1).to.not.equal(storage2)
    })
  })
  describe('测试setItem和getItem',function(){
    it('测试存取数字',function(){
      const num1 = 1000
      storage.setItem('key1',num1)
      const num2 = storage.getItem('key1')
      expect(num2).to.be.equal(num1)
    })
    it('测试存取undefined',function(){
      const value = undefined
      storage.setItem('key1',value)
      const value2 = storage.getItem('key1')
      expect(value).to.be.equal(value2)
    })
    it('测试存取null',function(){
      const value = null
      storage.setItem('key1',value)
      const value2 = storage.getItem('key1')
      expect(value).to.be.equal(value2)
    })
    it('测试存取字符',function(){
      const value = 'hi'
      storage.setItem('key1',value)
      const value2 = storage.getItem('key1')
      expect(value).to.be.equal(value2)
    })
    it('测试存取对象',function(){
      const value = {a:12,b:'hihi',c:undefined,d:function(){return 1},e:null}
      storage.setItem('key1',value)
      const value2 = storage.getItem('key1')
      expect(value2.a).to.be.equal(value.a)
      expect(value2.b).to.be.equal(value.b)
      expect(value2.e).to.be.equal(value.e)
      // console.log(value2)
    })
    it('测试过期时间设置为0',function(done){
      const storage = new EYStorage({expire:0})
      const value = {a:12,b:'hihi',c:undefined,d:function(){return 1},e:null}
      storage.setItem('key1',value)

      setTimeout(()=>{
        const value2 = storage.getItem('key1')
        expect(value2).to.be.equal(null)
        done()
      },100)
    })
    it('测试使用续期',function(done){
      const storage = new EYStorage({expire:500, isRenewal:true, isEncrypt: true})
      const value = {a:12,b:'hihi',c:undefined,d:function(){return 1},e:null}
      storage.setItem('key1',value)
      setTimeout(() => {
        const value2 = storage.getItem('key1')
        expect(value2.a).to.be.equal(12)
        done()
      }, 250)
      setTimeout(() => {
        const value2 = storage.getItem('key1')
        expect(value2.a).to.be.equal(12)
        done()
      }, 700)
      // setTimeout(() => {
      //   const value2 = storage.getItem('key1')
      //   expect(value2).to.be.equal(null)
      //   done()
      // }, 1800)
    })
    it('测试存字符(加密)取字符',function(){
      const storage1 = new EYStorage({isEncrypt:true})
      const value = 'hi'
      storage1.setItem('key1',value)
      const value2 = storage.getItem('key1')
      expect(value).to.be.equal(value2)
    })
    it('测试存字符(不加密)取字符',function(){
      const storage2 = new EYStorage({isEncrypt:false})
      const value = 'hi'
      storage2.setItem('key1',value)
      const value2 = storage.getItem('key1')
      expect(value).to.be.equal(value2)
    })
  })
  describe('测试change事件',function(){
    it('测试remove | 加密',function(){
        const storage = new EYStorage({
          prefix:'testRemove',
          isEncrypt:true
        })
        storage.setItem('key1','aaaa')
        storage.onchange = (event) => {
          // console.log(event)
          expect(event.key).to.be.equal('key1')
          expect(event.newValue).to.be.equal(null)
          expect(event.oldValue).to.be.equal('aaaa')
        }
        let i = 1
        storage.addEventListener("change",(event) => {
          expect(event.key).to.be.equal('key1')
          expect(event.newValue).to.be.equal(null)
          expect(event.oldValue).to.be.equal('aaaa')
          expect(i++).to.be.equal(1)
        })
        storage.addEventListener("change",(event) => {
          expect(event.key).to.be.equal('key1')
          expect(event.newValue).to.be.equal(null)
          expect(event.oldValue).to.be.equal('aaaa')
          expect(i++).to.be.equal(2)
        })
        storage.removeItem('key1')
      })
      it('测试clear | 加密',function(){
        const storage = new EYStorage({
          prefix:'testRemove2',
          isEncrypt:true
        })
        storage.setItem('key1','aaaa')
        storage.onchange = (event) => {
          expect(event.key).to.be.equal('key1')
          expect(event.newValue).to.be.equal(null)
          expect(event.oldValue).to.be.equal('aaaa')
        }
        let i = 1
        storage.addEventListener("change",(event) => {
          expect(event.key).to.be.equal('key1')
          expect(event.newValue).to.be.equal(null)
          expect(event.oldValue).to.be.equal('aaaa')
          expect(i++).to.be.equal(1)
        })
        storage.addEventListener("change",(event) => {
          expect(event.key).to.be.equal('key1')
          expect(event.newValue).to.be.equal(null)
          expect(event.oldValue).to.be.equal('aaaa')
          expect(i++).to.be.equal(2)
        })
        storage.clear()
      })
  })

})


