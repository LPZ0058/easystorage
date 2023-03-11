import { expect } from 'chai'
import EYStorage  from "@lpz0058/easystorage";
describe('测试npm上的包能否使用',function(){
  it('简单测试',function(){
    const storage = new EYStorage({
      prefix:"project",
      isRenewal:true
    })
    storage.setItem("key2",2)
    const key2 = storage.getItem("key2")
    expect(key2).to.be.equal(2)
  })
})