@Component('SpinHandle')
export class SpinHandle {
    active: boolean = false
    fraction: number = 0
    speed: number = 10000
    downpos: Vector3
    uppos: Vector3
    direction: Vector3 = Vector3.Backward()
}

const handle = engine.getComponentGroup(SpinHandle)

export class PullSystem implements ISystem {

  update(dt: number) {
      // iterate over the wheels in the component group
      for (let wheel of handle.entities) {
          // handy shortcuts
          let spin = wheel.get(SpinHandle)
          let transform = wheel.get(Transform)
          // check state
          if (spin.active) {
              // spin the wheel
              transform.rotate(spin.direction, spin.speed * dt)
          }
      }
  }
}

export class RotatorSystem implements ISystem {

    update(dt: number) {
        // iterate over the wheels in the component group
        for (let wheel of handle.entities) {
            // handy shortcuts
            let spin = wheel.get(SpinHandle)
            let transform = wheel.get(Transform)
            // check state
            if (spin.active) {
                // spin the wheel
                transform.rotate(spin.direction, spin.speed * dt)
            }
        }
    }
}

engine.addSystem(new RotatorSystem())


export class Slot_Machine {
    core: Entity = new Entity;
    wheel_1: Entity = new Entity;
    wheel_2: Entity = new Entity;
    wheel_3: Entity = new Entity;
    buttom_1: Entity = new Entity;
    buttom_2: Entity = new Entity;
    buttom_3: Entity = new Entity;
    spin_handle: Entity = new Entity;

    position: Vector3;

    size: number = 0.35;

    constructor(pos: Vector3){
      this.position = pos;
      
      this.build_shape()
      this.move()


      //this.spin_handle.add(new SpinHandle())
      this.wheel_1.add(new SpinHandle())
      this.spin_handle.add(
          new OnClick(e => {
              let spin = this.wheel_1.get(SpinHandle)
              if (!spin.active){
                  spin.active = true
                  log(spin)
              } else {
                spin.speed += 20
              }
          })
      )
    }

    build_shape(){
        this.core.add(new GLTFShape("models/Slot/SlotMachine.gltf"))
        this.wheel_1.add(new GLTFShape("models/Slot/wheel.gltf"))
        this.wheel_2.add(new GLTFShape("models/Slot/wheel.gltf"))
        this.wheel_3.add(new GLTFShape("models/Slot/wheel.gltf"))
        this.buttom_1.add(new GLTFShape("models/Slot/Buttom_01.gltf"))
        this.buttom_2.add(new GLTFShape("models/Slot/Buttom_02.gltf"))
        this.buttom_3.add(new GLTFShape("models/Slot/Buttom_03.gltf"))
        this.spin_handle.add(new GLTFShape("models/Slot/SpinHandle.gltf"))

        
    }

    move(){
      this.core.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      
      this.wheel_1.add(new Transform())
      this.wheel_2.add(new Transform())
      this.wheel_3.add(new Transform())

      this.spin_handle.add(new Transform())

      this.wheel_1.setParent(this.core)
      this.wheel_2.setParent(this.core)
      this.wheel_3.setParent(this.core)

      this.spin_handle.setParent(this.core)

      this.wheel_1.get(Transform).position.set(-0.13, 4.53, -0.86)
      this.wheel_2.get(Transform).position.set(-0.13, 4.53, 0)
      this.wheel_3.get(Transform).position.set(-0.13, 4.53, 0.86)

      this.spin_handle.get(Transform).position.set(0, 4.33, 1.74)
      /*
      this.wheel_2.add(new Transform({
        position: new Vector3(this.position.x-0.05, this.position.y+1.582, this.position.z),
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.wheel_3.add(new Transform({
        position: new Vector3(this.position.x-0.05, this.position.y+1.582, this.position.z+0.3),
        scale: new Vector3(this.size, this.size, this.size)
      }))*/
      this.buttom_1.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.buttom_2.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.buttom_3.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
    /*
    this.spin_handle.set(new Transform({
        position: new Vector3(this.position.x, this.position.y+1.51, this.position.z+0.58),
        scale: new Vector3(this.size, this.size, this.size),
    }));*/
    }

    rotate(value: number){
      this.core.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.wheel_1.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.wheel_2.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.wheel_3.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.buttom_1.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.buttom_2.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.buttom_3.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.spin_handle.get(Transform).rotation = Quaternion.Euler(0, value, 0)
    }

    show(){
      
      engine.addEntity(this.core)
      engine.addEntity(this.wheel_1)
      engine.addEntity(this.wheel_2)
      engine.addEntity(this.wheel_3)
      engine.addEntity(this.buttom_1)
      engine.addEntity(this.buttom_2)
      engine.addEntity(this.buttom_3)
      engine.addEntity(this.spin_handle)

      
    }
}